// Używamy importów ES Modules zamiast require
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Uzyskaj ścieżkę bieżącego katalogu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definiujemy ścieżkę główną - pełna ścieżka do folderu
const rootDir = 'C:/Users/kponi/OneDrive - SoftServe, Inc/Desktop/todo/muszka/bo/bo-freestyle-staff/public/freestyle-staff-academy';
// Definiujemy ścieżkę wyjściową dla pliku z listą
const outputFilePath = path.join(__dirname, 'sciezki-do-plikow.md');
// Lista do przechowywania ścieżek do plików wideo
const videoPaths = [];
// Lista do przechowywania ścieżek do wszystkich plików
const allPaths = [];

/**
 * Funkcja rekursywnie przeszukująca foldery i zbierająca ścieżki do plików
 * @param {string} directoryPath - Ścieżka do przeszukiwanego katalogu
 * @param {string} relativePath - Ścieżka względna od katalogu głównego
 */
const collectFilePaths = (directoryPath, relativePath = '') => {
  try {
    // Sprawdzamy, czy katalog istnieje
    if (!fs.existsSync(directoryPath)) {
      console.error(`Katalog nie istnieje: ${directoryPath}`);
      return;
    }
    
    const files = fs.readdirSync(directoryPath);
    
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const relativeFilePath = path.join(relativePath, file);
      
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // Jeśli to katalog, wchodzimy głębiej rekursywnie
        collectFilePaths(filePath, relativeFilePath);
      } else {
        // Dodajemy ścieżkę do listy wszystkich plików
        allPaths.push(relativeFilePath);
        
        // Sprawdzamy, czy to plik wideo
        const fileExtension = path.extname(file).toLowerCase();
        if (['.mp4', '.mov', '.avi', '.webm'].includes(fileExtension)) {
          videoPaths.push(relativeFilePath);
        }
      }
    }
  } catch (err) {
    console.error(`Błąd podczas przetwarzania katalogu ${directoryPath}:`, err);
  }
};

/**
 * Funkcja zapisująca zebrane ścieżki do pliku
 */
const savePathsToFile = () => {
  try {
    // Tworzymy zawartość pliku wyjściowego
    let content = '# Ścieżki do plików w folderze freestyle-staff-academy\n';
    content += `> Wygenerowano: ${new Date().toLocaleString('pl-PL')}\n\n`;
    
    // Sekcja z plikami wideo
    content += '## Pliki wideo\n\n';
    videoPaths.forEach(path => {
      content += `- \`${path}\`\n`;
    });
    
    content += `\n**Łączna liczba plików wideo: ${videoPaths.length}**\n\n`;
    
    // Sekcja ze wszystkimi plikami
    content += '## Wszystkie pliki\n\n';
    allPaths.forEach(path => {
      content += `- \`${path}\`\n`;
    });
    
    content += `\n**Łączna liczba wszystkich plików: ${allPaths.length}**\n`;
    
    // Zapisujemy do pliku
    fs.writeFileSync(outputFilePath, content, 'utf8');
    console.log(`Zapisano listę ścieżek do pliku: ${outputFilePath}`);
  } catch (err) {
    console.error('Błąd podczas zapisywania do pliku:', err);
  }
};

// Główna funkcja wykonująca całe zadanie
const main = () => {
  console.log(`Rozpoczynam zbieranie ścieżek do plików w katalogu: ${rootDir}`);
  
  try {
    // Sprawdzenie, czy podany katalog istnieje
    if (!fs.existsSync(rootDir)) {
      console.error(`Katalog główny nie istnieje: ${rootDir}`);
      console.log('Sprawdź, czy ścieżka jest poprawna i spróbuj ponownie.');
      return;
    }

    collectFilePaths(rootDir);
    savePathsToFile();
    console.log('Zakończono pomyślnie!');
  } catch (err) {
    console.error('Wystąpił błąd:', err);
  }
};

// Uruchamiamy skrypt
main();

// Easter egg: "Freestyle academy nigdy nie śpi! 🔥"