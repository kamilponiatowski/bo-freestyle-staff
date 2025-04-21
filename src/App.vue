<template>
  <div id="app">
    <header>
      <div class="container">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#8e44ad" />
            <path d="M30 70L70 30M30 50L70 50M30 30L70 70" stroke="white" stroke-width="5"
                  stroke-linecap="round" />
          </svg>
          <span>Freestyle Staff Academy</span>
        </div>
      </div>
    </header>

    <nav>
      <div class="container">
        <ul>
          <li>
            <router-link to="/">Start</router-link>
          </li>
          <li>
            <router-link to="/dashboard">Podsumowanie</router-link>
          </li>
          <li>
            <router-link to="/skills">Tricki i umiejętności</router-link>
          </li>
          <li>
            <router-link to="/skill-catalog">Katalog tricków</router-link>
          </li>
          <li>
            <router-link to="/badges">Odznaki</router-link>
          </li>
          <li>
            <router-link to="/library">Biblioteka</router-link>
          </li>
          <li>
            <router-link to="/progress">Mój postęp</router-link>
          </li>
          <li>
            <router-link to="/about">O Akademii</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer>
      <div class="container">
        <p>Freestyle Staff Academy - Tracker Postępów dla Muszki</p>
        <p>Stworzono z <span class="footer-heart">❤</span> przez Żuczka</p>
      </div>
    </footer>

    <div class="toast-container" id="toastContainer"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
@import './assets/styles/main.css';
</style>