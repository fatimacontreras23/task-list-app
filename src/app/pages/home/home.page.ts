import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alert } from '../../services/alert';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,


} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    
  ],
})
export class HomePage {
  


  constructor() {
  
  }

}