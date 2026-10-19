import { useState } from 'react';

export default function ExpenseTracker() {
  const [items, setItems] = useState([
    { id: 1, title: 'Кава', amount: 80 },
    { id: 2, title: 'Інтернет', amount: 300 }
  ]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [showOnlyExpensive, setShowOnlyExpensive] = useState(false);

  const addExpense = () => {
    if (!title || !amount) return;
    setItems([...items, { id: Date.now(), title, amount: Number(amount) }]);
    setTitle('');
    setAmount('');
  };

  const removeExpense = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const filteredItems = showOnlyExpensive
    ? items.filter(item => item.amount > 200)
    : items;

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Трекер витрат (React)</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Назва витрати" 
        />
        <input 
          type="number" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          placeholder="Сума" 
        />
        <button onClick={addExpense}>Додати</button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={showOnlyExpensive} 
            onChange={e => setShowOnlyExpensive(e.target.checked)} 
          />
          Показати тільки витрати {'>'} 200 грн
        </label>
      </div>

      {items.length === 0 ? (
        <p>Список витрат порожній</p>
      ) : (
        <>
          <ul>
            {filteredItems.map(item => (
              <li key={item.id}>
                {item.title} — {item.amount} грн
                <button onClick={() => removeExpense(item.id)} style={{ marginLeft: '10px' }}>×</button>
              </li>
            ))}
          </ul>
          <button onClick={clearAll} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
            Очистити все
          </button>
        </>
      )}

      <h3>Всього: {total} грн</h3>
      {total > 1000 && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ Увага! Ви перевищили денний ліміт бюджету!
        </p>
      )}
    </div>
  );
}