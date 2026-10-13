// ===================== IMPORTACIONES DE ANGULAR =====================

// Component: decorador para definir un componente.
// OnInit: interfaz para ejecutar código cuando el componente se inicia.
// ChangeDetectorRef: permite controlar manualmente la detección de cambios (actualizar la vista).
// inject: función moderna para inyectar dependencias sin usar el constructor.
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

// CommonModule: trae directivas comunes de Angular (*ngIf, *ngFor, pipes, etc.).
import { CommonModule } from '@angular/common';

// FormsModule: permite usar formularios con [(ngModel)] (enlace bidireccional).
import { FormsModule } from '@angular/forms';

// ===================== IMPORTACIONES DE IONIC =====================

// Componentes visuales de Ionic que se usan en el HTML:
import {
  IonContent,        // Contenedor principal del contenido de la página (con scroll).
  IonHeader,         // Encabezado superior de la página.
  IonTitle,          // Título dentro de la barra de herramientas.
  IonToolbar,        // Barra de herramientas (va dentro del header).
  IonItem,           // Elemento individual de una lista o formulario.
  IonInput,          // Campo de texto para que el usuario escriba.
  IonButton,         // Botón.
  IonButtons,        // Agrupa botones dentro de una toolbar.
  IonIcon,           // Muestra iconos.
  IonList,           // Contenedor de una lista de items.
  IonLabel,          // Texto/etiqueta dentro de un item.
  IonItemSliding,    // Item que se puede deslizar para mostrar opciones ocultas.
  IonItemOptions,    // Contenedor de las opciones que aparecen al deslizar.
  IonItemOption,     // Una opción individual al deslizar (ej: botón eliminar).
  IonReorder,        // Icono/zona que se arrastra para reordenar.
  IonReorderGroup,   // Grupo que contiene los elementos reordenables.
  ReorderEndCustomEvent, // Tipo del evento que se lanza al terminar de reordenar.
} from '@ionic/angular';

// addIcons: registra los iconos para poder usarlos en el HTML por su nombre.
import { addIcons } from 'ionicons';

// Iconos específicos que se usarán en la página.
import {
  addOutline,          // Icono de "+" (agregar).
  trashOutline,        // Icono de bote de basura (eliminar).
  reorderThreeOutline, // Icono de tres líneas (para arrastrar y reordenar).
  checkmarkOutline,    // Icono de palomita (confirmar/terminar).
} from 'ionicons/icons';

// Preferences: plugin de Capacitor para guardar datos (clave/valor) de forma persistente.
// Reemplaza al localStorage. Sus métodos son asíncronos (devuelven promesas).
import { Preferences } from '@capacitor/preferences';

// Servicio propio que muestra alertas (mensajes y confirmaciones).
import { Alert } from '../../services/alert';

// Clave con la que se guardarán las tareas en Preferences.
const STORAGE_KEY = 'tasks';

// ===================== DECORADOR DEL COMPONENTE =====================
@Component({
  selector: 'app-task-list',                 // Nombre de la etiqueta HTML para usar este componente.
  templateUrl: './task-list.page.html',      // Archivo HTML con la vista.
  styleUrls: ['./task-list.page.scss'],      // Archivo de estilos del componente.
  // Al ser un componente "standalone", aquí se declaran todos los módulos y
  // componentes que usa el HTML. Si falta alguno, no se mostrará en pantalla.
  imports: [
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonIcon,
    IonList,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonReorder,
    IonReorderGroup,
  ],
})
export class TaskListPage implements OnInit {
  // Inyecta el detector de cambios para forzar la actualización de la vista.
  private cdr = inject(ChangeDetectorRef);

  // Inyecta el servicio de alertas para mostrar mensajes al usuario.
  private alertservice: Alert = inject(Alert);

  // Arreglo donde se guardan todas las tareas (cada tarea es un texto).
  public tasks: string[] = [];

  // Texto de la tarea que el usuario está escribiendo en el input.
  public task: string = '';

  // Indica si el modo de reordenar está activo (true) o desactivado (false).
  public reorderEnabled = false;

  constructor() {
    // Registra los iconos para poder usarlos en el HTML con name="addOutline", etc.
    addIcons({
      addOutline,
      trashOutline,
      reorderThreeOutline,
      checkmarkOutline,
    });
  }

  // Se ejecuta automáticamente al iniciar el componente.
  // Se deja vacío a propósito: las tareas se cargan en ionViewWillEnter.
  ngOnInit() {}

  // Evento del ciclo de vida de Ionic: se ejecuta cada vez que la página va a mostrarse.
  // No necesita implementar ninguna interfaz, Ionic lo detecta por el nombre.
  // Es "async" porque Preferences.get devuelve una promesa y hay que esperarla (await).
  async ionViewWillEnter() {
    // Busca en Preferences si ya hay tareas guardadas.
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value) {
      // Convierte el texto JSON guardado de nuevo a un arreglo.
      this.tasks = JSON.parse(value);
      // Avisa a Angular que debe actualizar la vista con las tareas cargadas.
      this.cdr.markForCheck();
    }
  }

  // ---------- Agregar ----------
  addTask() {
    // Quita los espacios al inicio y al final del texto escrito.
    const text = this.task.trim();

    // Si el texto está vacío, no hace nada y sale de la función.
    if (!text) return;

    // Verifica que la tarea no exista ya en la lista.
    if (!this.ifExistsTask(text)) {
      this.tasks.push(text);   // Agrega la tarea al final del arreglo.
      this.saveTasks();        // Guarda la lista actualizada en Preferences.
      this.task = '';          // Limpia el input.
      this.alertservice.alertMessage('Éxito', 'Tarea agregada exitosamente');
    } else {
      // Si ya existe, avisa al usuario con un mensaje de error.
      this.alertservice.alertMessage('Error', 'La tarea ya existe');
    }
  }

  // Revisa si una tarea ya existe, sin importar mayúsculas/minúsculas ni espacios extra.
  // Devuelve la tarea encontrada (valor "truthy") o undefined si no existe.
  private ifExistsTask(task: string) {
    return this.tasks.find(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );
  }

  // ---------- Eliminar ----------
  // Muestra una alerta de confirmación antes de eliminar.
  confirmDeleteTask(task: string) {
    this.alertservice.alertConfirm(
      'Confirmar',
      'eliminar tarea',
      '¿Estás seguro de que deseas eliminar la tarea ',
      () => this.deleteTask(task) // Callback: solo se ejecuta si el usuario confirma.
    );
  }

  // Elimina la tarea del arreglo.
  private deleteTask(task: string) {
    // Busca la posición (índice) de la tarea en el arreglo.
    const index = this.tasks.findIndex(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );

    // findIndex devuelve -1 si no encontró nada, por eso se valida.
    if (index !== -1) {
      this.tasks.splice(index, 1);  // Elimina 1 elemento en esa posición.
      this.saveTasks();             // Guarda los cambios en Preferences.
      this.cdr.markForCheck();      // Avisa a Angular que debe actualizar la vista.
      this.alertservice.alertMessage('Éxito', 'Tarea eliminada');
    }
  }

  // ---------- Reordenar ----------
  // Activa o desactiva el modo de reordenamiento (cambia true <-> false).
  toggleReorder() {
    this.reorderEnabled = !this.reorderEnabled;
  }

  // Se ejecuta cuando el usuario termina de arrastrar un elemento.
  handleReorder(event: ReorderEndCustomEvent) {
    // Muestra en consola desde qué posición se movió y a cuál llegó (útil para depurar).
    console.log(`Dragged from index ${event.detail.from} to ${event.detail.to}`);

    // complete() mueve el elemento en el arreglo y finaliza la animación.
    this.tasks = event.detail.complete(this.tasks);

    // Guarda el nuevo orden en Preferences.
    this.saveTasks();
  }

  // ---------- Guardar ----------
  // Guarda el arreglo de tareas con Preferences.
  // JSON.stringify convierte el arreglo a texto, porque Preferences solo guarda strings.
  // Es "async" porque Preferences.set devuelve una promesa.
  private async saveTasks() {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(this.tasks),
    });
  }
}