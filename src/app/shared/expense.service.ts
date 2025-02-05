import { Injectable } from '@angular/core';
import { Expense } from './expense.interface';
import { Days } from './days.enum';
import { ExpensesByDay } from './expenses-by-day.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  days: string[] = Object.values(Days);
  currentDay: string = this.days[0];
  expenses: { [day: string]: Expense[] } = {};

  constructor() {}

  selectDay(day: string) {
    this.currentDay = day;
  }

  addExpense(expense: Expense) {
    if (!this.expenses[this.currentDay]) {
      this.expenses[this.currentDay] = [];
    }
    this.expenses[this.currentDay].push(expense);
  }

  deleteExpense(day: string, index: number) {
    if (this.expenses[day]) {
      this.expenses[day].splice(index, 1);
    }
  }

  getDailyTotal(day: string): number {
    return (
      this.expenses[day]?.reduce(
        (total, expense) => total + expense.amount,
        0
      ) || 0
    );
  }

  getWeeklySummary(): ExpensesByDay {
    return this.days.reduce((summary, day) => {
      summary[day] = this.getDailyTotal(day);
      return summary;
    }, {} as ExpensesByDay);
  }
}
