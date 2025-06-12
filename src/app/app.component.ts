import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> <button
  *ngIf="showInstallButton"
  (click)="installApp()"
  class="fixed bottom-5 right-5 bg-[#418622] text-white px-4 py-2 rounded-2xl shadow-lg z-50"
>
  📲 Instalar Forehapp
</button> `,
})
export class AppComponent {
   deferredPrompt: any = null;
  showInstallButton = false;

  // Escucha el evento que dispara Chrome cuando puede instalar la app
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault(); // Evita el prompt automático
    this.deferredPrompt = event;
    this.showInstallButton = true; // Muestra el botón en el HTML
  }

  // Método para lanzar el prompt cuando el usuario da clic
  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((result: any) => {
        if (result.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación');
        } else {
          console.log('Usuario rechazó la instalación');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }

  
}
