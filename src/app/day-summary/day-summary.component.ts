import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseService } from '../shared/expense.service';

@Component({
  selector: 'app-day-summary',
  standalone: true,
  imports: [CommonModule, ExpenseListComponent],
  templateUrl: './day-summary.component.html',
  styleUrl: './day-summary.component.scss',
})
export class DaySummaryComponent {
  total: number = 0;
  isClicked: boolean = false;

  @Input({required: true}) day!: string;

  constructor(public expenseService: ExpenseService) {}

  clicked() {
    this.isClicked = !this.isClicked;
  }
}
