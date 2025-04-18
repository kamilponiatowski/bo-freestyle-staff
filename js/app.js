// DOM Elements
const welcomePage = document.getElementById('welcomePage');
const mainApp = document.getElementById('mainApp');
const enterAppBtn = document.getElementById('enterApp');
const navLinks = document.querySelectorAll('nav a');
const pageContents = document.querySelectorAll('.page-content');
const skillItems = document.querySelectorAll('.skill-item');
const fileFolderHeaders = document.querySelectorAll('.file-folder-header');
const fileItems = document.querySelectorAll('.file-item');
const resourceViewer = document.getElementById('resourceViewer');
const closeResourceBtn = document.getElementById('closeResourceBtn');
const skillDetailModal = document.getElementById('skillDetailModal');
const closeSkillModalBtn = document.getElementById('closeSkillModal');
const markCompletedBtn = document.getElementById('markCompletedBtn');
const congratsModal = document.getElementById('congratsModal');
const closeCongratsModalBtn = document.getElementById('closeCongratsModal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const addRepsBtn = document.getElementById('addRepsBtn');
const addTrainingBtn = document.getElementById('addTrainingBtn');
const startTodayTrainingBtn = document.getElementById('startTodayTraining');
const toastContainer = document.getElementById('toastContainer');
const confettiContainer = document.getElementById('confettiContainer');
const progressChart = document.getElementById('progressChart');

// UI Functions
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function switchTab(tabId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    pageContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    const activeContent = document.getElementById(`${tabId}Page`);
    if (activeContent) activeContent.classList.add('active');
}

function showSkillDetail(skillId) {
    const skillElement = document.querySelector(`.skill-item[data-skill-id="${skillId}"]`);
    if (!skillElement) return;
    
    const videoPath = skillElement.dataset.videoPath;
    const mdPath = skillElement.dataset.mdPath;
    
    const skill = skillDetailsData[skillId] || {
        name: skillElement.querySelector('.skill-name').textContent.split(' ')[0],
        difficulty: 3,
        description: 'Szczegółowy opis tej umiejętności będzie dostępny wkrótce!',
        videoPath: videoPath,
        tips: [
            'Zacznij powoli, skupiając się na poprawnej technice',
            'Regularnie ćwicz dla najlepszych efektów',
            'Pamiętaj o rozgrzewce przed treningiem',
            'Bądź cierpliwy, każda umiejętność wymaga czasu'
        ]
    };
    
    const userSkill = userData.skills[skillId] || {
        progress: 0,
        reps: 0,
        goalReps: 1000
    };
    
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.textContent = skill.name;
    
    const difficultyStars = document.querySelector('.skill-details-difficulty');
    difficultyStars.innerHTML = `<strong>Poziom trudności:</strong> `;
    for (let i = 1; i <= 5; i++) {
        difficultyStars.innerHTML += `<span class="skill-star ${i <= skill.difficulty ? 'filled' : ''}">★</span>`;
    }
    
    const description = document.querySelector('.skill-details-description');
    description.textContent = skill.description;
    
    const videoContainer = document.querySelector('.skill-video-container video');
    videoContainer.src = skill.videoPath;
    
    const tipsList = document.querySelector('.skill-tips ul');
    tipsList.innerHTML = '';
    skill.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    const repProgress = document.querySelector('.rep-progress-value');
    const progress = (userSkill.reps / userSkill.goalReps) * 100;
    repProgress.style.width = `${progress}%`;
    
    const repCounter = document.querySelector('.skill-rep-tracker h4');
    repCounter.textContent = `Licznik powtórzeń (${userSkill.reps}/${userSkill.goalReps})`;
    
    skillDetailModal.dataset.skillId = skillId;
    skillDetailModal.style.display = 'flex';
}

function hideSkillDetail() {
    skillDetailModal.style.display = 'none';
    const videoContainer = document.querySelector('.skill-video-container video');
    videoContainer.pause();
    videoContainer.src = '';
}

function toggleFolderContent(folderHeader) {
    const folder = folderHeader.parentElement;
    folder.classList.toggle('open');
}

function showResourceContent(filePath) {
    const resourceTitle = document.querySelector('.resource-viewer-title');
    const resourceContent = document.querySelector('.resource-viewer-content');
    
    // Extract filename from path
    const fileName = filePath.split('/').pop();
    resourceTitle.textContent = fileName;
    
    // Determine file type and render appropriately
    if (filePath.endsWith('.mp4')) {
        resourceContent.innerHTML = `
            <video controls width="100%">
                <source src="${filePath}" type="video/mp4">
                Twoja przeglądarka nie obsługuje odtwarzania wideo.
            </video>
            <p class="mb-3">Oglądasz film instruktażowy: ${fileName}</p>
            <p>Wykorzystaj ten materiał, by dokładnie przeanalizować technikę wykonania.</p>
        `;
    } else if (filePath.endsWith('.md')) {
        // For simplicity, just show the file name
        resourceContent.innerHTML = `
            <p class="mb-3">Plik dokumentacji: ${fileName}</p>
            <p>Ten dokument zawiera szczegółowe informacje o technice.</p>
            <div class="markdown-content">
                <p>Ładowanie treści...</p>
            </div>
        `;
        
        // In a real app, you would load and parse the markdown file here
        setTimeout(() => {
            const markdownContent = document.querySelector('.markdown-content');
            markdownContent.innerHTML = `
                <h2>Opis umiejętności</h2>
                <p>Ten plik zawiera szczegółowe informacje o technice ${fileName.split('.')[0]}.</p>
                <p>Zwróć uwagę na prawidłową pozycję ciała i ruchy rąk podczas wykonywania tego triku.</p>
                <h3>Zalecane powtórzenia:</h3>
                <p>Wykonuj przynajmniej 30-50 powtórzeń dziennie, aby opanować tę technikę.</p>
            `;
        }, 500);
    } else if (filePath.endsWith('.pdf')) {
        resourceContent.innerHTML = `
            <p class="mb-3">Dokument PDF: ${fileName}</p>
            <p>Ten plik zawiera szczegółowe materiały w formacie PDF.</p>
            <p>Aby otworzyć go, kliknij poniższy przycisk:</p>
            <a href="${filePath}" class="btn btn-primary" target="_blank">Otwórz PDF</a>
        `;
    } else {
        resourceContent.innerHTML = `
            <p>Ten typ pliku nie jest obsługiwany w podglądzie.</p>
        `;
    }
    
    resourceViewer.style.display = 'block';
}

function hideResourceViewer() {
    resourceViewer.style.display = 'none';
    const videos = resourceViewer.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
        video.src = '';
    });
}

function showCongratsModal(badgeId) {
    const badge = userData.badges.find(b => b.id === badgeId) || {
        name: 'Nowa odznaka',
        description: 'Gratulacje z zdobycia nowej odznaki!',
        icon: '🏆',
        color: '#f39c12'
    };
    
    const badgeIcon = document.querySelector('.badge-unlocked');
    badgeIcon.textContent = badge.icon;
    badgeIcon.style.backgroundColor = badge.color || '#f39c12';
    
    const badgeTitle = document.querySelector('.congrats-title');
    badgeTitle.textContent = `Zdobyłaś nową odznakę!`;
    
    const badgeText = document.querySelector('.congrats-text');
    badgeText.textContent = `Właśnie odblokowałaś odznakę "${badge.name}" - ${badge.description}! Tak trzymaj!`;
    
    createConfetti();
    congratsModal.style.display = 'flex';
}

function hideCongratsModal() {
    congratsModal.style.display = 'none';
}

function showToast(message, type = 'success') {
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
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#f39c12', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 10}px`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

function initProgressChart() {
    if (!progressChart) return;
    
    // W rzeczywistej aplikacji dane byłyby pobierane z API
    // Tu używamy przykładowych danych
    const chartContext = progressChart.getContext('2d');
    
    // Pobieram dane wykresu z pliku chart-config.js
    createProgressChart(chartContext);
}

function addTraining() {
    const date = document.getElementById('trainingDate').value;
    const skillId = document.getElementById('trainingSkill').value;
    const reps = parseInt(document.getElementById('trainingReps').value);
    const notes = document.getElementById('trainingNotes').value;
    
    if (!skillId || !reps || reps < 1) {
        showToast('Wypełnij wszystkie pola formularza', 'error');
        return;
    }
    
    const skillName = document.querySelector(`#trainingSkill option[value="${skillId}"]`).textContent;
    
    // Update user data
    userData.trainingHistory.unshift({
        date,
        skill: skillName,
        reps,
        notes
    });
    
    if (userData.skills[skillId]) {
        userData.skills[skillId].reps += reps;
        const progress = (userData.skills[skillId].reps / userData.skills[skillId].goalReps) * 100;
        userData.skills[skillId].progress = Math.min(100, progress);
        
        if (progress >= 100 && userData.skills[skillId].status !== 'completed') {
            userData.skills[skillId].status = 'completed';
            userData.progress.completedSkills++;
            userData.progress.inProgressSkills--;
            showCongratsModal('1000-reps');
        } else if (progress > 0 && userData.skills[skillId].status === 'new') {
            userData.skills[skillId].status = 'in-progress';
            userData.progress.inProgressSkills++;
        }
    }
    
    // Update UI
    const trainingHistory = document.getElementById('trainingHistory');
    const entry = document.createElement('div');
    entry.className = 'training-entry';
    entry.innerHTML = `
        <div class="training-date">${date}</div>
        <div class="training-skill">${skillName}</div>
        <div class="training-reps">${reps} powtórzeń</div>
        <div class="training-notes">${notes || 'Brak notatek'}</div>
    `;
    trainingHistory.insertBefore(entry, trainingHistory.firstChild);
    
    // Reset form
    document.getElementById('trainingNotes').value = '';
    
    showToast('Trening został dodany pomyślnie!');
}

function addReps() {
    const skillId = skillDetailModal.dataset.skillId;
    const reps = parseInt(document.querySelector('.rep-input').value);
    
    if (!reps || reps < 1) {
        showToast('Wprowadź liczbę powtórzeń', 'error');
        return;
    }
    
    // Update user data
    if (userData.skills[skillId]) {
        userData.skills[skillId].reps += reps;
        const progress = (userData.skills[skillId].reps / userData.skills[skillId].goalReps) * 100;
        userData.skills[skillId].progress = Math.min(100, progress);
        
        if (progress >= 100 && userData.skills[skillId].status !== 'completed') {
            userData.skills[skillId].status = 'completed';
            userData.progress.completedSkills++;
            userData.progress.inProgressSkills--;
            showCongratsModal('1000-reps');
        } else if (progress > 0 && userData.skills[skillId].status === 'new') {
            userData.skills[skillId].status = 'in-progress';
            userData.progress.inProgressSkills++;
        }
        
        // Update UI in modal
        const repProgress = document.querySelector('.rep-progress-value');
        repProgress.style.width = `${Math.min(100, progress)}%`;
        
        const repCounter = document.querySelector('.skill-rep-tracker h4');
        repCounter.textContent = `Licznik powtórzeń (${userData.skills[skillId].reps}/${userData.skills[skillId].goalReps})`;
        
        // Reset input
        document.querySelector('.rep-input').value = 10;
        
        showToast(`Dodano ${reps} powtórzeń!`);
        
        // Add to training history
        const today = new Date().toISOString().split('T')[0];
        const skillName = skillDetailsData[skillId]?.name || 'Umiejętność';
        
        userData.trainingHistory.unshift({
            date: today,
            skill: skillName,
            reps,
            notes: 'Dodano z poziomu szczegółów umiejętności'
        });
    }
}

function markSkillCompleted() {
    const skillId = skillDetailModal.dataset.skillId;
    
    if (userData.skills[skillId]) {
        userData.skills[skillId].status = 'completed';
        userData.skills[skillId].progress = 100;
        userData.skills[skillId].reps = userData.skills[skillId].goalReps;
        
        if (userData.skills[skillId].status !== 'completed') {
            userData.progress.completedSkills++;
            userData.progress.inProgressSkills--;
        }
        
        // Update UI
        hideSkillDetail();
        showCongratsModal('1000-reps');
        showToast('Umiejętność została oznaczona jako opanowana!');
    }
}

function startTodayTraining() {
    // Start a training session for today
    showToast('Rozpoczęto dzisiejszy trening!');
    switchTab('skills');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Welcome page navigation
    enterAppBtn.addEventListener('click', () => {
        switchPage('mainApp');
        initProgressChart();
    });
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.dataset.page;
            if (tab) switchTab(tab);
        });
    });
    
    // Skill interactions
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillId = item.dataset.skillId;
            showSkillDetail(skillId);
        });
    });
    
    // File explorer interactions
    fileFolderHeaders.forEach(header => {
        header.addEventListener('click', () => {
            toggleFolderContent(header);
        });
    });
    
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const filePath = item.dataset.filePath;
            showResourceContent(filePath);
        });
    });
    
    closeResourceBtn.addEventListener('click', hideResourceViewer);
    
    closeSkillModalBtn.addEventListener('click', hideSkillDetail);
    
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideSkillDetail();
            hideCongratsModal();
        });
    });
    
    markCompletedBtn.addEventListener('click', markSkillCompleted);
    closeCongratsModalBtn.addEventListener('click', hideCongratsModal);
    
    addRepsBtn.addEventListener('click', addReps);
    addTrainingBtn.addEventListener('click', addTraining);
    startTodayTrainingBtn.addEventListener('click', startTodayTraining);
    
    // Initialize folder structure
    document.querySelectorAll('.file-folder').forEach(folder => {
        folder.querySelector('.file-folder-header').addEventListener('click', function() {
            folder.classList.toggle('open');
        });
    });
});