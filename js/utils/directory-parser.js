/**
 * Freestyle Staff Academy - Parser struktury katalogu
 * 
 * Ten moduł jest odpowiedzialny za parsowanie struktury katalogu
 * i generowanie drzewa katalogów dla komponentu biblioteki.
 * 
 * Wielki wschodni smok czeka w ukryciu! 🐉
 */

const DirectoryParser = (function() {
    // Klucz cache'a
    const CACHE_KEY = 'freestyle-staff-directory-structure';
    
    // Funkcja parsująca zawartość pliku struktura_katalogu.md
    const parseDirectoryStructure = function(content) {
        if (!content) return [];
        
        // Tablica wynikowa z pełną strukturą katalogów
        const result = [];
        
        // Podziel na linie i pomiń pierwsze linie nagłówka
        const lines = content.split('\n');
        let startIndex = 0;
        
        // Pomiń linię nagłówka i datę generowania
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('* 📁')) {
                startIndex = i;
                break;
            }
        }
        
        // Mapa przechowująca referencje do folderów według poziomu zagnieżdżenia
        const folderRefs = { 0: { children: result } };
        
        // Przetwórz każdą linię, która zawiera element katalogu
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Określ poziom zagnieżdżenia na podstawie liczby spacji na początku linii
            const indentation = lines[i].search(/\S/);
            const level = Math.floor(indentation / 2);
            
            // Utwórz obiekt dla elementu (folder lub plik)
            let item = null;
            
            if (line.includes('📁') || line.includes('folder')) {
                // Element jest folderem
                const folderName = line.match(/\*\s+📁\s+\*\*([^*]+)\*\*\//) || 
                                 line.match(/\*\s+📁\s+\*\*([^*]+)\*\*/);
                
                if (folderName && folderName[1]) {
                    item = {
                        type: 'folder',
                        name: folderName[1].trim(),
                        path: folderName[1].trim(),
                        children: []
                    };
                    
                    // Zapisz referencję do tego folderu
                    folderRefs[level + 1] = item;
                }
            } else if (line.includes('📝') || line.includes('.md')) {
                // Element jest plikiem markdown
                const fileName = line.match(/\*\s+📝\s+([^*]+)\.md/) || 
                               line.match(/\*\s+📝\s+([^*]+)/);
                
                if (fileName && fileName[1]) {
                    item = {
                        type: 'file',
                        fileType: 'md',
                        name: `${fileName[1].trim()}.md`,
                        path: `${fileName[1].trim()}.md`,
                        icon: '📄'
                    };
                }
            } else if (line.includes('🎬') || line.includes('.mp4')) {
                // Element jest plikiem wideo
                const fileName = line.match(/\*\s+🎬\s+([^*]+)\.mp4/) || 
                               line.match(/\*\s+🎬\s+([^*]+)/);
                
                if (fileName && fileName[1]) {
                    item = {
                        type: 'file',
                        fileType: 'mp4',
                        name: `${fileName[1].trim()}.mp4`,
                        path: `${fileName[1].trim()}.mp4`,
                        icon: '🎬'
                    };
                }
            } else if (line.includes('📑') || line.includes('.pdf')) {
                // Element jest plikiem PDF
                const fileName = line.match(/\*\s+📑\s+([^*]+)\.pdf/) || 
                               line.match(/\*\s+📑\s+([^*]+)/);
                
                if (fileName && fileName[1]) {
                    item = {
                        type: 'file',
                        fileType: 'pdf',
                        name: `${fileName[1].trim()}.pdf`,
                        path: `${fileName[1].trim()}.pdf`,
                        icon: '📑'
                    };
                }
            } else if (line.includes('🖼️') || line.includes('.png') || line.includes('.jpg')) {
                // Element jest obrazem
                const fileName = line.match(/\*\s+🖼️\s+([^*]+)\.(png|jpg|jpeg)/) || 
                               line.match(/\*\s+🖼️\s+([^*]+)/);
                
                if (fileName && fileName[1]) {
                    const extension = fileName[2] || 'png';
                    item = {
                        type: 'file',
                        fileType: extension,
                        name: `${fileName[1].trim()}.${extension}`,
                        path: `${fileName[1].trim()}.${extension}`,
                        icon: '🖼️'
                    };
                }
            } else if (line.includes('📜') || line.match(/\*\s+[^📁📝🎬📑🖼️]\s+.+\..+/)) {
                // Element jest innym typem pliku
                const fileName = line.match(/\*\s+([^*📁📝🎬📑🖼️\s]+)\s+([^*]+)/);
                
                if (fileName && fileName[2]) {
                    item = {
                        type: 'file',
                        fileType: 'other',
                        name: fileName[2].trim(),
                        path: fileName[2].trim(),
                        icon: '📄'
                    };
                }
            }
            
            // Dodaj element do odpowiedniego folderu nadrzędnego
            if (item) {
                const parentFolder = folderRefs[level];
                if (parentFolder && parentFolder.children) {
                    // Buduj pełną ścieżkę
                    if (parentFolder.fullPath) {
                        item.fullPath = `${parentFolder.fullPath}/${item.path}`;
                    } else if (level > 0) {
                        item.fullPath = `${parentFolder.path}/${item.path}`;
                    } else {
                        item.fullPath = item.path;
                    }
                    
                    parentFolder.children.push(item);
                }
            }
        }
        
        return result;
    };
    
    // Generuj HTML dla struktury katalogów
    const generateDirectoryHTML = function(directoryTree) {
        if (!directoryTree || directoryTree.length === 0) return '';
        
        let html = '<ul class="file-list">';
        
        directoryTree.forEach(item => {
            if (item.type === 'folder') {
                // Element jest folderem
                html += `
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">${item.name}</span>
                        </div>
                        <ul class="file-folder-content">
                            ${generateDirectoryHTML(item.children)}
                        </ul>
                    </li>
                `;
            } else if (item.type === 'file') {
                // Element jest plikiem
                const fileClass = `file-${item.fileType || 'other'}`;
                html += `
                    <li class="file-item ${fileClass}" data-file-path="freestyle-staff-academy/${item.fullPath}">
                        <span class="file-item-icon">${item.icon || '📄'}</span>
                        <span class="file-item-name">${item.name}</span>
                    </li>
                `;
            }
        });
        
        html += '</ul>';
        return html;
    };
    
    // Pobierz strukturę katalogów z cache'a lub parsuj na nowo
    const getDirectoryStructure = function(forceRefresh = false) {
        // Sprawdź cache
        if (!forceRefresh) {
            const cachedStructure = localStorage.getItem(CACHE_KEY);
            if (cachedStructure) {
                try {
                    return JSON.parse(cachedStructure);
                } catch (e) {
                    console.error('Błąd podczas parsowania struktury katalogów z cache:', e);
                }
            }
        }
        
        return null;
    };
    
    // Zapisz strukturę katalogów do cache'a
    const saveDirectoryStructure = function(structure) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(structure));
            return true;
        } catch (e) {
            console.error('Błąd podczas zapisywania struktury katalogów do cache:', e);
            return false;
        }
    };
    
    // Załaduj strukturę katalogu z pliku
    const loadDirectoryStructure = function(callback) {
        // Najpierw sprawdź cache
        const cachedStructure = getDirectoryStructure();
        if (cachedStructure) {
            callback(null, cachedStructure);
            return;
        }
        
        // Jeśli nie ma cache'a, załaduj z pliku
        fetch('struktura_katalogu.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nie udało się załadować pliku struktury katalogów');
                }
                return response.text();
            })
            .then(content => {
                const structure = parseDirectoryStructure(content);
                saveDirectoryStructure(structure);
                callback(null, structure);
            })
            .catch(error => {
                console.error('Błąd podczas ładowania struktury katalogów:', error);
                
                // Sprawdź, czy struktura jest dostępna w jakimś innym formacie
                if (window.directoryStructure) {
                    callback(null, window.directoryStructure);
                } else {
                    callback(error, null);
                }
            });
    };
    
    // Znajdź element w strukturze katalogów po ścieżce
    const findItemByPath = function(structure, path) {
        if (!structure || !path) return null;
        
        const pathParts = path.replace('freestyle-staff-academy/', '').split('/');
        let currentLevel = structure;
        let currentItem = null;
        
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            
            // Szukamy elementu na obecnym poziomie
            currentItem = currentLevel.find(item => 
                item.name === part || 
                item.path === part || 
                (item.fullPath && item.fullPath.endsWith(part))
            );
            
            // Jeśli nie znaleźliśmy elementu lub to ostatnia część ścieżki, kończymy
            if (!currentItem || i === pathParts.length - 1) break;
            
            // Jeśli element jest folderem, przechodzimy do jego zawartości
            if (currentItem.type === 'folder' && currentItem.children) {
                currentLevel = currentItem.children;
            } else {
                // Jeśli to nie folder, nie możemy iść głębiej
                break;
            }
        }
        
        return currentItem;
    };
    
    // Publiczny interfejs API
    return {
        parseDirectoryStructure: parseDirectoryStructure,
        generateDirectoryHTML: generateDirectoryHTML,
        getDirectoryStructure: getDirectoryStructure,
        saveDirectoryStructure: saveDirectoryStructure,
        loadDirectoryStructure: loadDirectoryStructure,
        findItemByPath: findItemByPath
    };
})();

// Eksportuj moduł
window.DirectoryParser = DirectoryParser;