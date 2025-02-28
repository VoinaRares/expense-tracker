import { Component, Input } from '@angular/core';
import { ExpenseService } from '../../shared/expense.service';
import { Expense } from '../../shared/expense.interface';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';


@Component({
  selector: 'app-day-summary-detail',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './day-summary-detail.component.html',
  styleUrl: './day-summary-detail.component.scss'
})
export class DaySummaryDetailComponent {
  dailyExpenses: Expense[] = [];
  @Input({ required: true }) day!: string;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: [] as number[],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(public expenseService: ExpenseService) {
    this.expenseService.expenses$.subscribe({
      next: () => {
        this.dailyExpenses = expenseService.getExpensesForDay(this.day);
      }});
  }

  ngOnInit() {
    this.dailyExpenses = this.expenseService.getExpensesForDay(this.day);
    this.updateChart();
  }

  updateChart(){
    this.pieChartLabels = [...new Set(this.dailyExpenses.map(expense => expense.category))];
    this.dailyExpenses.forEach(expense => {
      const index = this.pieChartLabels.indexOf(expense.category);
      if( this.pieChartDatasets[0].data[index]){
        this.pieChartDatasets[0].data[index] += expense.amount;
      }
      else{
        this.pieChartDatasets[0].data[index] = expense.amount
      }
    }
    );

    console.log(this.pieChartDatasets[0].data);
  }
}
