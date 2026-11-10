package io.ionic.starter;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MascotasWidgetProvider extends AppWidgetProvider {

  private static final String API_URL = "http://10.13.19.115:8080/api/mascotas";
  private static final String ACTION_REFRESH = "com.mradopciones.app.ACTION_REFRESH";
  public static final String PREFS = "widget_prefs";
  public static final String KEY_OPACIDAD = "opacidad_";

  @Override
  public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
    actualizar(context, manager, ids);
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    super.onReceive(context, intent);
    if (ACTION_REFRESH.equals(intent.getAction())) {
      AppWidgetManager manager = AppWidgetManager.getInstance(context);
      int[] ids = manager.getAppWidgetIds(new ComponentName(context, MascotasWidgetProvider.class));
      actualizar(context, manager, ids);
    }
  }

  private void actualizar(Context context, AppWidgetManager manager, int[] ids) {
    // goAsync permite hacer la petición de red fuera del hilo principal
    final PendingResult result = goAsync();

    new Thread(() -> {
      String conteo;
      String ultima;
      try {
        JSONArray lista = new JSONArray(descargar());
        int total = lista.length();
        conteo = total == 1 ? "1 mascota disponible" : total + " mascotas disponibles";

        if (total > 0) {
          JSONObject m = lista.getJSONObject(0); // el backend ordena por id desc
          ultima = "Más reciente: " + m.getString("nombre") + " (" + m.getInt("edad") + " años)";
        } else {
          ultima = "Vuelve pronto :3";
        }
      } catch (Exception e) {
        conteo = "Sin conexión";
        ultima = "Toca ↻ para reintentar";
      }

      for (int id : ids) {
        manager.updateAppWidget(id, construirVista(context, id, conteo, ultima));
      }
      result.finish();
    }).start();
  }

  private RemoteViews construirVista(Context context, int widgetId, String conteo, String ultima) {
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_mascotas);
    views.setTextViewText(R.id.widget_count, conteo);
    views.setTextViewText(R.id.widget_latest, ultima);

    int porcentaje = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .getInt(KEY_OPACIDAD + widgetId, 100);
    views.setInt(R.id.widget_bg, "setImageAlpha", porcentaje * 255 / 100);

    // Tocar el widget abre la app
    Intent abrir = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    PendingIntent abrirPi = PendingIntent.getActivity(
      context, 0, abrir, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.widget_root, abrirPi);

    // Botón actualizar
    Intent refrescar = new Intent(context, MascotasWidgetProvider.class).setAction(ACTION_REFRESH);
    PendingIntent refrescarPi = PendingIntent.getBroadcast(
      context, 1, refrescar, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.widget_refresh, refrescarPi);

    return views;
  }

  private String descargar() throws Exception {
    HttpURLConnection con = (HttpURLConnection) new URL(API_URL).openConnection();
    con.setConnectTimeout(8000);
    con.setReadTimeout(8000);
    try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
      StringBuilder sb = new StringBuilder();
      String linea;
      while ((linea = br.readLine()) != null) sb.append(linea);
      return sb.toString();
    } finally {
      con.disconnect();
    }
  }
}
