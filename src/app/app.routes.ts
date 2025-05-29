import { Routes } from '@angular/router';
import { DayExpenseComponent } from './day-expense/day-expense.component';
import { SummaryComponent } from './summary/summary.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Monday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Tuesday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Wednesday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Thursday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Friday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Saturday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Sunday', component: DayExpenseComponent, canActivate: [authGuard] },
  { path: 'Total', component: SummaryComponent, canActivate: [authGuard] },
];
