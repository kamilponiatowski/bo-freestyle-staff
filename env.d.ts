/// <reference types="vite/client" />

// Deklaracja dla Chart.js
declare module 'chart.js/auto' {
    import { Chart } from 'chart.js';
    export default Chart;
  }