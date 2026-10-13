import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/list/list.page').then((m) => m.ListPage),
  },
  {
    path: 'task-list',
    loadComponent: () =>
      import('./pages/task-list/task-list.page').then((m) => m.TaskListPage),
  },
];
