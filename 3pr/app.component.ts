import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Expense {
  id: number;
  title: string;
  amount: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2>Трекер витрат (Angular)</h2>

      <div style="margin-bottom: 10px;">
        <input [(ngModel)]="title" placeholder="Назва витрати" />
        <input type="number" [(ngModel)]="amount" placeholder="Сума" />
        <button (click)="addExpense()">Додати</button>
      </div>

      <div style="margin-bottom: 10px;">
        <label>
          <input type="checkbox" [(ngModel)]="showOnlyExpensive" />
          Показати тільки витрати > 200 грн
        </label>
      </div>

      @if (items.length === 0) {
        <p>Список витрат порожній</p>
      } @else {
        <ul>
          @for (item of filteredItems; track item.id) {
            <li>
              {{ item.title }} — {{ item.amount }} грн
              <button (click)="removeExpense(item.id)" style="margin-left: 10px;">×</button>
            </li>
          }
        </ul>
        <button (click)="clearAll()" style="background-color: #ff4d4d; color: white;">
          Очистити все
        </button>
      }

      <h3>Всього: {{ total }} грн</h3>
      @if (total > 1000) {
        <p style="color: red; font-weight: bold;">
          ⚠️ Увага! Ви перевищили денний ліміт бюджету!
        </p>
      }
    </div>
  `
})
export class AppComponent {
  items: Expense[] = [
    { id: 1, title: 'Кава', amount: 80 },
    { id: 2, title: 'Інтернет', amount: 300 }
  ];
  title: string = '';
  amount: number | null = null;
  showOnlyExpensive: boolean = false;

  addExpense(): void {
    if (!this.title || !this.amount) return;
    this.items.push({
      id: Date.now(),
      title: this.title,
      amount: Number(this.amount)
    });
    this.title = '';
    this.amount = null;
  }

  removeExpense(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  clearAll(): void {
    this.items = [];
  }

  get filteredItems(): Expense[] {
    return this.showOnlyExpensive
      ? this.items.filter(item => item.amount > 200)
      : this.items;
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.amount, 0);
  }
}