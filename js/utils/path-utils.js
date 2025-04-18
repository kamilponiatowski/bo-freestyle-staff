/**
 * Freestyle Staff Academy - Narzędzia do ścieżek plików
 * 
 * Ten moduł zawiera pomocnicze funkcje do pracy ze ścieżkami plików i operacji na nich.
 */

const PathUtils = (function() {
    // Publiczny interfejs API
    return {
        // Pobierz nazwę pliku ze ścieżki
        getFileName: function(path) {
            // Usuń potencjalne parametry URL po znaku ?
            const pathWithoutParams = path.split('?')[0];
            
            // Pobierz ostatni element ze ścieżki
            const parts = pathWithoutParams.split('/');
            return parts[parts.length - 1];
        },
        
        // Pobierz rozszerzenie pliku
        getFileExtension: function(path) {
            const fileName = this.getFileName(path);
            const parts = fileName.split('.');
            
            if (parts.length === 1) {
                return '';
            }
            
            return parts[parts.length - 1].toLowerCase();
        },
        
        // Pobierz nazwę pliku bez rozszerzenia
        getFileNameWithoutExtension: function(path) {
            const fileName = this.getFileName(path);
            const parts = fileName.split('.');
            
            if (parts.length === 1) {
                return fileName;
            }
            
            return parts.slice(0, -1).join('.');
        },
        
        // Pobierz ścieżkę bez nazwy pliku
        getDirectoryPath: function(path) {
            const parts = path.split('/');
            
            if (parts.length === 1) {
                return '';
            }
            
            return parts.slice(0, -1).join('/');
        },
        
        // Połącz ścieżki
        joinPaths: function(...paths) {
            return paths
                .filter(path => path && path.length > 0)
                .map((path, index) => {
                    // Usuń końcowe slashe, z wyjątkiem pierwszego elementu, gdy zaczyna się od "/"
                    if (index === 0 && path.startsWith('/')) {
                        return path.endsWith('/') ? path.slice(0, -1) : path;
                    }
                    // Usuń początkowe i końcowe slashe
                    return path.replace(/^\/+|\/+$/g, '');
                })
                .join('/');
        },
        
        // Formatuj ścieżkę do wyświetlenia (skrócone)
        formatPathForDisplay: function(path, maxLength = 40) {
            if (path.length <= maxLength) {
                return path;
            }
            
            const fileName = this.getFileName(path);
            const directory = this.getDirectoryPath(path);
            
            // Jeśli sama nazwa pliku jest dłuższa niż maxLength, skróć ją
            if (fileName.length >= maxLength - 3) {
                return fileName.substring(0, maxLength - 3) + '...';
            }
            
            // Oblicz ile znaków może być w ścieżce do katalogu
            const maxDirLength = maxLength - fileName.length - 4; // 4 znaki na ".../"
            
            // Skróć ścieżkę do katalogu i dodaj nazwę pliku
            if (maxDirLength > 0) {
                return directory.substring(0, maxDirLength) + '.../' + fileName;
            }
            
            return '.../' + fileName;
        },
        
        // Sprawdź, czy ścieżka jest obrazem
        isImagePath: function(path) {
            const ext = this.getFileExtension(path);
            return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
        },
        
        // Sprawdź, czy ścieżka jest wideo
        isVideoPath: function(path) {
            const ext = this.getFileExtension(path);
            return ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext);
        },
        
        // Sprawdź, czy ścieżka jest dokumentem
        isDocumentPath: function(path) {
            const ext = this.getFileExtension(path);
            return ['pdf', 'doc', 'docx', 'txt', 'md', 'markdown'].includes(ext);
        }
    };
})();

// Eksportuj moduł
window.PathUtils = PathUtils;