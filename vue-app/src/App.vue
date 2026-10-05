<script setup>
    import { ref } from 'vue';

    const count = ref(0);
</script>

<template>
    <div class="container">
        <h1>Привіт, світ! Це Vue.js 🟢</h1>
        <p>Виконав: <strong>П.О.О., група КН 3/2</strong></p>
        <button class="btn" @click="count++">
            Бокалов: {{ count }}
        </button>
    </div>
</template>

<style scoped>
    .container {
        text-align: center;
        font-family: sans-serif;
        margin-top: 50px;
    }

    .btn {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
</style>