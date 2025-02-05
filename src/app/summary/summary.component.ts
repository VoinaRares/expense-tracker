import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesByDay } from '../shared/expenses-by-day.interface';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  @Input() summary!: ExpensesByDay;

  getSummaryKeys(): string[] {
    return Object.keys(this.summary);
  }
}
