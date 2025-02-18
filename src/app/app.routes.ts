import { Routes } from '@angular/router';
import { DayExpenseComponent } from './day-expense/day-expense.component';
import { SummaryComponent } from './summary/summary.component';

export const routes: Routes = [
  {path: '', redirectTo: 'Monday', pathMatch: 'full'},
  {path: 'Monday', component: DayExpenseComponent},
  {path: 'Tuesday', component: DayExpenseComponent},
  {path: 'Wednesday', component: DayExpenseComponent},
  {path: 'Thursday', component: DayExpenseComponent},
  {path: 'Friday', component: DayExpenseComponent},
  {path: 'Saturday', component: DayExpenseComponent},
  {path: 'Sunday', component: DayExpenseComponent},
  {path: 'Total', component: SummaryComponent},
];
