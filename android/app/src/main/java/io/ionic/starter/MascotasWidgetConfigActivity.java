package io.ionic.starter;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;

public class MascotasWidgetConfigActivity extends Activity {

  private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Si el usuario sale sin guardar, el widget no se agrega
    setResult(RESULT_CANCELED);
    setContentView(R.layout.activity_widget_config);

    Bundle extras = getIntent().getExtras();
    if (extras != null) {
      widgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID,
        AppWidgetManager.INVALID_APPWIDGET_ID);
    }
    if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
      finish();
      return;
    }

    SeekBar seek = findViewById(R.id.config_seek);
    TextView valor = findViewById(R.id.config_valor);
    Button guardar = findViewById(R.id.config_guardar);

    SharedPreferences prefs = getSharedPreferences(MascotasWidgetProvider.PREFS, MODE_PRIVATE);
    int porcentaje = prefs.getInt(MascotasWidgetProvider.KEY_OPACIDAD + widgetId, 100);

    seek.setProgress(porcentaje - 20);
    valor.setText(porcentaje + "%");

    seek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
      @Override
      public void onProgressChanged(SeekBar s, int progress, boolean fromUser) {
        valor.setText((progress + 20) + "%");
      }
      @Override public void onStartTrackingTouch(SeekBar s) {}
      @Override public void onStopTrackingTouch(SeekBar s) {}
    });

    guardar.setOnClickListener(v -> {
      int elegido = seek.getProgress() + 20;
      prefs.edit().putInt(MascotasWidgetProvider.KEY_OPACIDAD + widgetId, elegido).apply();

      // Pide al widget que se redibuje con la nueva opacidad
      Intent actualizar = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
      actualizar.setComponent(new ComponentName(this, MascotasWidgetProvider.class));
      actualizar.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{widgetId});
      sendBroadcast(actualizar);

      Intent resultado = new Intent();
      resultado.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
      setResult(RESULT_OK, resultado);
      finish();
    });
  }
}
