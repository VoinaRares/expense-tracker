import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../shared/expense.service';
import { DaySummaryDetailComponent } from './day-summary-detail/day-summary-detail.component';

@Component({
  selector: 'app-day-summary',
  standalone: true,
  imports: [CommonModule, DaySummaryDetailComponent],
  templateUrl: './day-summary.component.html',
  styleUrl: './day-summary.component.scss',
})
export class DaySummaryComponent{
  total: number = 0;
  isClicked: boolean = false;

  @Input({ required: true }) day!: string;

  constructor(public expenseService: ExpenseService) {}

  ngOnInit(){
    this.total = this.expenseService.getDailyTotal(this.day);
  }

  clicked() {
    this.isClicked = !this.isClicked;
  }
}
