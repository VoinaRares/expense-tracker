import { Component } from '@angular/core';
import { ExpenseService } from './shared/expense.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(public expenseService: ExpenseService) {}
}
