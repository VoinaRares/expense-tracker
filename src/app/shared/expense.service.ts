import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Expense } from './expense.interface';
import { Days } from './days.enum';
import { ExpensesByDay } from './expenses-by-day.interface';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Firestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  days: string[] = Object.values(Days);
  private currentDaySubject = new BehaviorSubject<string>('Monday');
  currentDay$ = this.currentDaySubject.asObservable();
  private expensesSubject = new BehaviorSubject<{ [day: string]: Expense[] }>({});
  expenses$ = this.expensesSubject.asObservable();
  private userId: string | null = null;
  private expensesListener: Subscription | null = null;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router, private firestore: Firestore, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.listenToExpenses();
      } else {
        this.userId = null;
        this.expensesSubject.next({});
        if (this.expensesListener) {
          this.expensesListener.unsubscribe();
        }
      }
    });

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

  private listenToExpenses() {
    if (!this.userId) return;
    this.loadingSubject.next(true);
    const expensesCol = collection(this.firestore, `users/${this.userId}/expenses`);
    let firstSnapshot = true;
    onSnapshot(expensesCol, (snapshot) => {
      const expensesByDay: { [day: string]: Expense[] } = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Expense & { day: string };
        if (!expensesByDay[data.day]) expensesByDay[data.day] = [];
        expensesByDay[data.day].push({ ...data, firestoreId: docSnap.id });
      });
      this.expensesSubject.next(expensesByDay);
      if (firstSnapshot) {
        this.loadingSubject.next(false);
        firstSnapshot = false;
      }
    });
  }

  getExpensesForDay(day: string): Expense[] {
    return this.expensesSubject.value[day] || [];
  }

  getCurrentDaySubject(): string {
    return this.currentDaySubject.value;
  }

  selectDay(day: string) {
    if (!this.days.includes(day)) {
      throw new Error(`Invalid day selected: ${day}`);
    }
    this.currentDaySubject.next(day);
  }

  async addExpense(expense: Expense) {
    if (!this.userId) throw new Error('User not authenticated');
    if (!this.days.includes(this.currentDaySubject.value)) {
      throw new Error(`Cannot add expense to invalid day: ${this.currentDaySubject.value}`);
    }
    const day = this.currentDaySubject.value;
    const expensesCol = collection(this.firestore, `users/${this.userId}/expenses`);
    await addDoc(expensesCol, { ...expense, day });
  }

  async deleteExpense(day: string, id: number) {
    if (!this.userId) throw new Error('User not authenticated');
    const expenses = this.getExpensesForDay(day);
    const expense = expenses.find(e => e.id === id);
    if (expense && expense.firestoreId) {
      const expenseDoc = doc(this.firestore, `users/${this.userId}/expenses/${expense.firestoreId}`);
      await deleteDoc(expenseDoc);
    }
  }

  getDailyTotal(day: string): number {
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

  async editExpense(editedExpense: Expense) {
    if (!this.userId) throw new Error('User not authenticated');
    const day = this.currentDaySubject.value;
    const expenses = this.getExpensesForDay(day);
    const expense = expenses.find(e => e.id === editedExpense.id);
    if (expense && expense.firestoreId) {
      const expenseDoc = doc(this.firestore, `users/${this.userId}/expenses/${expense.firestoreId}`);
      await updateDoc(expenseDoc, { ...editedExpense, day });
    }
  }
}
