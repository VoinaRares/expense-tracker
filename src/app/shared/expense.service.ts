import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Expense } from './expense.interface';
import { Days } from './days.enum';
import { ExpensesByDay } from './expenses-by-day.interface';
import { of, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  days: string[] = Object.values(Days);
  private currentDaySubject = new BehaviorSubject<string>('Monday');
  currentDay$ = this.currentDaySubject.asObservable();
  private expensesSubject = new BehaviorSubject<{ [day: string]: Expense[] }>({});
  expenses$ = this.expensesSubject.asObservable();
  private storageKey = 'expenses';

  constructor(private router: Router) {
    try {
      this.loadExpensesFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize expenses:', error);
      this.expensesSubject.next({});
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          const urlSegments = event.urlAfterRedirects.split('/');
          const dayFromUrl = urlSegments[1];
          if (this.days.includes(dayFromUrl)) {
            this.currentDaySubject.next(dayFromUrl);
          } else {
            console.warn(`Invalid day from URL: ${dayFromUrl}. Using current day: ${this.currentDaySubject.value}`);
          }
        },
        error: (err) => console.error('Router event error:', err)
      });
  }

  getExpensesForDay(day: string): Expense[] {
    return this.expensesSubject.value[day] || [];
  }

  getCurrentDaySubject(): string {
    return this.currentDaySubject.value;
  }

  private loadExpensesFromLocalStorage(): void {
    try {
      const storedExpenses = localStorage.getItem(this.storageKey);
      if (storedExpenses) {
        const parsed = JSON.parse(storedExpenses);
        if (this.isValidExpensesStructure(parsed)) {
          this.expensesSubject.next(parsed);
        } else {
          console.error('Invalid expenses structure in localStorage. Resetting expenses.');
          localStorage.setItem(this.storageKey, "{}");
          this.expensesSubject.next({});
        }
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      throw new Error('Failed to load expenses from storage');
    }
  }

  private findNextId(){
    let maxId = 0;
    for (const day in this.expensesSubject.value) {
      this.expensesSubject.value[day].forEach((expense) => {
        if (expense.id > maxId) {
          maxId = expense.id;
        }
      });
    }
    return maxId + 1;
  }

  private isValidExpensesStructure(data: Expense[]): boolean {
    return typeof data === 'object' && Object.keys(data).every((key) => {
      if (!this.days.includes(key)) {
        return false;
      }
      return true;
    });
  }

  private saveExpensesToLocalStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.expensesSubject.value));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
      throw new Error('Failed to persist expenses to storage');
    }
  }

  selectDay(day: string) {
    if (!this.days.includes(day)) {
      throw new Error(`Invalid day selected: ${day}`);
    }
    this.currentDaySubject.next(day);
  }

  addExpense(expense: Expense) {
    if (!this.days.includes(this.currentDaySubject.value)) {
      throw new Error(`Cannot add expense to invalid day: ${this.currentDaySubject.value}`);
    }

    try {
      const currentExpenses = this.expensesSubject.value;
      if (!currentExpenses[this.currentDaySubject.value]) {
        currentExpenses[this.currentDaySubject.value] = [];
      }
      expense.id = this.findNextId();
      currentExpenses[this.currentDaySubject.value].push(expense);
      this.expensesSubject.next(currentExpenses);
      this.saveExpensesToLocalStorage();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw new Error('Failed to add expense');
    }
  }

  deleteExpense(day: string, id: number) {
    if (!this.days.includes(day)) {
      throw new Error(`Invalid day: ${day}`);
    }

    const currentExpenses = this.expensesSubject.value;
    try {
      currentExpenses[day] = currentExpenses[day].filter((expense) => {
        return expense.id !== id;
      });
      this.expensesSubject.next(currentExpenses);
      this.saveExpensesToLocalStorage();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }
  }

  getDailyTotal(day: string): number {
    if (!this.days.includes(day)) {
      console.warn(`Invalid day requested for total: ${day}`);
      return 0;
    }

    return (
      this.expensesSubject.value[day]?.reduce(
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

  editExpense(edittedExpense: Expense) {
    if (!this.days.includes(this.currentDaySubject.value)) {
      throw new Error(`Cannot edit expense on invalid day: ${this.currentDaySubject.value}`);
    }

    try {
      const currentExpenses = this.expensesSubject.value;
      if (!currentExpenses[this.currentDaySubject.value]) {
        currentExpenses[this.currentDaySubject.value] = [];
      }
      for (const i in currentExpenses[this.currentDaySubject.value]) {
        if(currentExpenses[this.currentDaySubject.value][i].id === edittedExpense.id){
          currentExpenses[this.currentDaySubject.value][i] = edittedExpense;
        }
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      throw new Error('Failed to edit expense');
    }
  }
}
