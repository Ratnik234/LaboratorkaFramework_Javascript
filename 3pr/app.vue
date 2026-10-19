<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, title: 'Кава', amount: 80 },
  { id: 2, title: 'Інтернет', amount: 300 }
]);
const title = ref('');
const amount = ref('');
const showOnlyExpensive = ref(false);

const addExpense = () => {
  if (!title.value || !amount.value) return;
  items.value.push({
    id: Date.now(),
    title: title.value,
    amount: Number(amount.value)
  });
  title.value = '';
  amount.value = '';
};

const removeExpense = (id) => {
  items.value = items.value.filter(item => item.id !== id);
};

const clearAll = () => {
  items.value = [];
};

const filteredItems = computed(() => {
  return showOnlyExpensive.value
    ? items.value.filter(item => item.amount > 200)
    : items.value;
});

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.amount, 0);
});
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h2>Трекер витрат (Vue 3)</h2>

    <div style="margin-bottom: 10px;">
      <input v-model="title" placeholder="Назва витрати" />
      <input type="number" v-model.number="amount" placeholder="Сума" />
      <button @click="addExpense">Додати</button>
    </div>

    <div style="margin-bottom: 10px;">
      <label>
        <input type="checkbox" v-model="showOnlyExpensive" />
        Показати тільки витрати > 200 грн
      </label>
    </div>

    <div v-if="items.length === 0">
      <p>Список витрат порожній</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="item in filteredItems" :key="item.id">
          {{ item.title }} — {{ item.amount }} грн
          <button @click="removeExpense(item.id)" style="margin-left: 10px;">×</button>
        </li>
      </ul>
      <button @click="clearAll" style="background-color: #ff4d4d; color: white;">
        Очистити все
      </button>
    </div>

    <h3>Всього: {{ total }} грн</h3>
    <p v-if="total > 1000" style="color: red; font-weight: bold;">
      ⚠️ Увага! Ви перевищили денний ліміт бюджету!
    </p>
  </div>
</template>