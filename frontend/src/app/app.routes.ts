import { Routes } from '@angular/router';
import { Quiz } from './features/quiz/quiz';

export const routes: Routes = [
  {
    path: '',
    component: Quiz,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
