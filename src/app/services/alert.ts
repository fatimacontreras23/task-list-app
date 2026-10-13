import { Service } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { inject } from '@angular/core';


@Service()
export class Alert {
    //el decorador @service() marca la clase como un servicio
//que puede ser inyectado en otros componentes o servicios de la aplicación
    private alertController:AlertController= inject(AlertController);

    async presentAlert() {
        const alert = await this.alertController.create({
            header:'A short Title Is Best', 
            subHeader:'A sub header is ok',
            message: 'A message should be a short, complete sentence.',
            buttons: ['Acction'],
        });
        await alert.present();
    }   

    
    async alertMessage(
    header: string, // Titulo de la alerta
    message: string, // Mensaje de la alerta
    )
    {
    // Hace un await para crear 
    // la alerta con el header y el message
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    // present() es un método que 
    // muestra la alerta en pantalla
    await alert.present();
  } 

   async alertConfirm(
    header: string, 
    message: string, 
    subHeader: string,
    funcionOk: Function,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Confirmar',
    )
    {
    // Hace un await para crear 
    // la alerta con el header y el message
    const alert = await this.alertController.create({
      header,
      message,
      subHeader,
      buttons: [ 
        {

      text: cancelText,
      role: 'cancel',
      
    },
    {
      text: confirmText,
      role: 'confirm',
      handler: () => {
       funcionOk();
      },
    },
  ],

    });
    // present() es un método que 
    // muestra la alerta en pantalla
    await alert.present();
  } 




}
