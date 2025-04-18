# Freestyle Staff Tracker App 🥢✨

Aplikacja do śledzenia postępów w nauce technik kręcenia staffem według filozofii "1000 powtórzeń do mistrzostwa".

## 📋 Opis

Freestyle Staff Tracker to aplikacja webowa stworzona dla entuzjastów Freestyle Staff Spinningu, która pomaga w śledzeniu postępów nauki różnych technik i trików. Bazuje na filozofii, że do osiągnięcia mistrzostwa w danej umiejętności potrzeba 1000 jakościowych powtórzeń.

### ✨ Główne funkcje

- 📊 Śledzenie postępów w nauce technik Freestyle Staff
- 🏆 System odznak za osiągnięcia
- 📋 Organizacja umiejętności według kategorii trudności
- 📝 Dodawanie notatek treningowych
- 📺 Dostęp do materiałów wideo i dokumentacji
- 📈 Statystyki i raporty treningowe

## 🛠 Instalacja i uruchomienie

### Metoda 1: Szybki start

1. Pobierz pliki `freestyle-staff-tracker.html` i `report-generator.js`
2. Otwórz plik `freestyle-staff-tracker.html` w przeglądarce internetowej
3. Gotowe! Aplikacja działa lokalnie i zapisuje dane w localStorage Twojej przeglądarki

### Metoda 2: Integracja z repozytorium freestyle-staff-academy

1. Sklonuj to repozytorium do folderu obok katalogu `freestyle-staff-academy`:
   ```bash
   git clone https://github.com/yourusername/bo-freestyle-staff.git
   ```

2. Dodaj plik `.gitignore` z następującą zawartością, aby nie umieszczać plików wideo w repozytorium:
   ```
   # Ignoruj pliki wideo i inne duże pliki
   *.mp4
   *.mov
   *.pdf
   ```

3. Skopiuj plik `freestyle-staff-tracker.html` do głównego katalogu repozytorium
4. Otwórz plik `freestyle-staff-tracker.html` w przeglądarce

## 🚀 Jak używać

### Rozpoczęcie pracy

1. Otwórz aplikację w przeglądarce
2. Przejrzyj dostępne umiejętności podzielone na kategorie:
   - Podstawowe
   - Średniozaawansowane
   - Zaawansowane

### Śledzenie postępów

1. Wybierz umiejętność, którą chcesz ćwiczyć klikając na jej kafelek
2. Obejrzyj materiały instruktażowe (jeśli dostępne)
3. Po sesji treningowej dodaj liczbę wykonanych powtórzeń
4. Opcjonalnie dodaj notatkę opisującą Twoje postępy

### Generowanie raportu treningowego

1. Załaduj skrypt `report-generator.js` w konsoli lub podłącz go do aplikacji
2. Wywołaj funkcję `createTrainingReport()`
3. Plik PDF z raportem zostanie automatycznie pobrany

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na urządzeniach:
- Komputerach stacjonarnych
- Laptopach
- Tabletach
- Telefonach komórkowych

## 💾 Przechowywanie danych

Wszystkie dane są przechowywane lokalnie w localStorage Twojej przeglądarki. Oznacza to, że:
- Nie wymagane jest połączenie z internetem po załadowaniu aplikacji
- Dane są dostępne nawet po zamknięciu przeglądarki
- Dane są przypisane do konkretnej przeglądarki i urządzenia

⚠️ **Uwaga**: Czyszczenie danych przeglądarki spowoduje utratę postępów. Regularnie generuj raporty PDF, aby zachować kopię zapasową swoich osiągnięć.

## 📝 Filozofia "1000 powtórzeń do mistrzostwa"

Aplikacja bazuje na koncepcji, że do prawdziwego opanowania dowolnej umiejętności potrzeba wykonać około 1000 jakościowych powtórzeń. Ta liczba:

1. Pozwala przejść przez wszystkie etapy nauki:
   - Początkowa niezdarność
   - Świadoma kompetencja
   - Nieświadoma kompetencja (automatyzm)

2. Buduje silne połączenia neuronowe:
   - Zamienia umiejętność w pamięć mięśniową
   - Pozwala wykonywać ruch intuicyjnie
   - Utrwala prawidłową technikę

3. Buduje mentalność i dyscyplinę:
   - Uczy cierpliwości
   - Pokazuje wartość systematycznej pracy
   - Daje satysfakcję z mierzalnego postępu

## ⚡ Pamiętaj!

> "Wolno znaczy płynnie, płynnie znaczy szybko."

Nie dąż do szybkiego wykonywania ruchów. Skup się na jakości każdego powtórzenia, a prędkość przyjdzie naturalnie wraz z biegłością.

## 🙏 Podziękowania

Aplikacja została stworzona z myślą o Muszce i jest inspirowana metodologią nauczania Freestyle Staff rozwijaną przez Michelle C. Smith.

---

Stworzone z 💜 przez Żuczka