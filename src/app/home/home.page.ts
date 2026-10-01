import {Component} from '@angular/core';
import {IonCard, IonCol, IonContent, IonGrid, IonIcon, IonRow} from '@ionic/angular';
import {addIcons} from 'ionicons';
import {home, informationCircleOutline, newspaperOutline, paw, people, personOutline} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon
  ]
})
export class HomePage {
  constructor() {
    addIcons({
      paw,
      home,
      people,
      informationCircleOutline,
      newspaperOutline,
      personOutline
    });
  }
}
