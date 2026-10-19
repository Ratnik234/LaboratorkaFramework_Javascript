import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Filter,
  Plus,
  ReceiptText,
  Sparkles,
  Trash2,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Expense = {
  id: string;
  title: string;
  amount: number;
  created_at: string;
};

const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [showOnlyExpensive, setShowOnlyExpensive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('id, title, amount, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMessage('Не вдалося завантажити витрати. Спробуйте оновити сторінку.');
      } else {
        setExpenses((data ?? []) as Expense[]);
      }
      setIsLoading(false);
    };

    void loadExpenses();
  }, []);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses],
  );

  const visibleExpenses = useMemo(
    () => showOnlyExpensive
      ? expenses.filter((expense) => Number(expense.amount) > 200)
      : expenses,
    [expenses, showOnlyExpensive],
  );

  const addExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Вкажіть назву та суму більшу за 0 грн.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const { data, error } = await supabase
      .from('expenses')
      .insert({ title: cleanTitle, amount: numericAmount })
      .select('id, title, amount, created_at')
      .maybeSingle();

    if (error || !data) {
      setErrorMessage('Не вдалося додати витрату. Перевірте з’єднання та спробуйте ще раз.');
    } else {
      setExpenses((current) => [data as Expense, ...current]);
      setTitle('');
      setAmount('');
      setNotice('Витрату додано');
      window.setTimeout(() => setNotice(''), 2200);
    }
    setIsSaving(false);
  };

  const removeExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      setErrorMessage('Не вдалося видалити витрату. Спробуйте ще раз.');
      return;
    }
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

  const clearAll = async () => {
    if (expenses.length === 0) return;
    const { error } = await supabase.from('expenses').delete().not('id', 'is', null);
    if (error) {
      setErrorMessage('Не вдалося очистити список. Спробуйте ще раз.');
      return;
    }
    setExpenses([]);
    setNotice('Список очищено');
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <main className="app-shell">
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Гривня — на головну">
            <span className="brand-mark"><WalletCards size={21} strokeWidth={2.4} /></span>
            <span>гривня<span className="brand-dot">.</span></span>
          </a>
          <div className="topbar-note"><span className="status-dot" /> особистий фінансовий простір</div>
        </header>

        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> контроль починається з ясності</div>
            <h1>Твої витрати.<br /><em>Твій контроль.</em></h1>
            <p>Додавай щоденні покупки, бач загальну картину та приймай рішення спокійніше.</p>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-icon"><TrendingUp size={18} /></span>
            <span><strong>{expenses.length}</strong><small>записів у журналі</small></span>
            <ArrowUpRight className="hero-arrow" size={17} />
          </div>
        </section>

        <section className="summary-grid" aria-label="Підсумок витрат">
          <article className="summary-card summary-card-primary">
            <div className="summary-card-top"><span>Загальна сума</span><span className="summary-icon"><WalletCards size={17} /></span></div>
            <strong>{currencyFormatter.format(total)}</strong>
            <small>за весь період</small>
          </article>
          <article className="summary-card">
            <div className="summary-card-top"><span>У журналі</span><span className="summary-icon light"><ReceiptText size={17} /></span></div>
            <strong>{currencyFormatter.format(total)}</strong>
            <small>усі додані записи</small>
          </article>
          <article className={`summary-card ${total > 1000 ? 'summary-card-warning' : ''}`}>
            <div className="summary-card-top"><span>Денний ліміт</span><span className="summary-icon light"><TrendingUp size={17} /></span></div>
            <strong>{total > 1000 ? 'Перевищено' : currencyFormatter.format(1000 - total)}</strong>
            <small>{total > 1000 ? 'варто звернути увагу' : 'залишилось у запасі'}</small>
          </article>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div><p className="section-kicker">Новий запис</p><h2>Додати витрату</h2></div>
            <span className="step-label">01 / 02</span>
          </div>
          <form className="expense-form" onSubmit={addExpense}>
            <label className="field field-title">
              <span>Назва витрати</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Наприклад, кава з друзями" maxLength={120} />
            </label>
            <label className="field field-amount">
              <span>Сума</span>
              <div className="amount-input"><input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" /><b>грн</b></div>
            </label>
            <button className="add-button" type="submit" disabled={isSaving}><Plus size={19} /> {isSaving ? 'Додаємо…' : 'Додати'}</button>
          </form>
          {errorMessage && <div className="message error-message"><AlertTriangle size={17} /> {errorMessage}</div>}
          {notice && <div className="message success-message"><Check size={17} /> {notice}</div>}
        </section>

        <section className="workspace list-section">
          <div className="section-heading list-heading">
            <div><p className="section-kicker">Історія</p><h2>Останні витрати <span>{expenses.length}</span></h2></div>
            <div className="list-actions">
              <button className={`filter-button ${showOnlyExpensive ? 'active' : ''}`} type="button" onClick={() => setShowOnlyExpensive((value) => !value)}><Filter size={16} /> понад 200 грн</button>
              <button className="clear-button" type="button" onClick={() => void clearAll()} disabled={expenses.length === 0}><Trash2 size={16} /> очистити все</button>
            </div>
          </div>

          <div className="expense-list">
            {isLoading ? <div className="empty-state"><div className="loader" /><p>Завантажуємо журнал витрат…</p></div> : visibleExpenses.length === 0 ? <div className="empty-state"><span className="empty-icon"><ReceiptText size={23} /></span><p>{showOnlyExpensive ? 'Витрат понад 200 грн поки немає.' : 'Список витрат порожній.'}</p><small>Додайте перший запис вище</small></div> : visibleExpenses.map((expense, index) => (
              <article className="expense-row" key={expense.id}>
                <div className="expense-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="expense-symbol"><ReceiptText size={18} /></div>
                <div className="expense-details"><strong>{expense.title}</strong><small>{new Date(expense.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}</small></div>
                <strong className="expense-amount">{currencyFormatter.format(Number(expense.amount))}</strong>
                <button className="delete-button" type="button" onClick={() => void removeExpense(expense.id)} aria-label={`Видалити ${expense.title}`}><Trash2 size={17} /></button>
              </article>
            ))}
          </div>

          {total > 1000 && <div className="limit-warning"><span><AlertTriangle size={18} /></span><div><strong>Денний ліміт перевищено</strong><p>Сьогоднішня сума більша за 1 000 грн. Час переглянути пріоритети.</p></div><ArrowUpRight size={18} /></div>}
        </section>
        <footer><span>гривня. / твій простір для ясних рішень</span><span>дані зберігаються автоматично</span></footer>
      </div>
    </main>
  );
}

export default App;
