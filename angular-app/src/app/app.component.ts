import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
      <h1>Привіт, світ! Це Angular 🔴=))))</h1>
      <p>Виконав(ла): <strong>П.О.О., група КН 3/2</strong></p>
      <button
        style="padding: 10px 20px; font-size: 16px; cursor: pointer;"
        (click)="increment()"
      >
        Кліків: {{ count() }}
      </button>
    </div>
  `
})
export class AppComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}
