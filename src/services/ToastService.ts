/**
 * Wyświetla toast z powiadomieniem
 */
export const showToast = (message: string, type: string = 'success') => {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Dodaj animację wejścia
  setTimeout(() => {
    toast.classList.add('toast-visible');
  }, 10);

  // Ustaw timer usunięcia
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export default {
  showToast
};