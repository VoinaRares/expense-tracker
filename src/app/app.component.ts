import { Component } from '@angular/core';
import { DaySelectorComponent } from './day-selector/day-selector.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { SummaryComponent } from './summary/summary.component';
import { Expense } from './shared/expense.interface';
import { ExpenseService } from './shared/expense.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DaySelectorComponent,
    ExpenseFormComponent,
    ExpenseListComponent,
    SummaryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(public expenseService: ExpenseService) {}
}
