<template>
    <div class="about-academy">
        <section class="hero-section">
            <div class="container">
                <h1 class="page-title">Witaj w <span class="accent-text">Freestyle Staff Academy</span></h1>
                <h2 class="subtitle">Uwolnij swojego wewnętrznego mistrza. Zapanuj nad swoim życiem.</h2>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="video-container">
                    <img src="/images/academy/MichelleCSmithimg.webp" alt="Freestyle Staff Academy Video"
                        class="video-placeholder" />
                    <div class="play-button" @click="playVideo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                    </div>

                    <video v-if="isPlaying" controls autoplay class="video-element" @ended="isPlaying = false">
                        <source :src="videoPath" type="video/mp4">
                        Twoja przeglądarka nie obsługuje odtwarzania wideo.
                    </video>
                </div>

                <div class="academy-info">
                    <div class="info-card">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5"></path>
                                <path d="M2 12l10 5 10-5"></path>
                            </svg>
                        </div>
                        <h3>Stopniowa nauka</h3>
                        <p>Nasz program nauczania jest zaprojektowany tak, aby prowadzić Cię krok po kroku od podstaw do
                            zaawansowanych trików.</p>
                    </div>

                    <div class="info-card">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                </path>
                                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <h3>Szczegółowe instrukcje</h3>
                        <p>Każda technika jest drobiazgowo wyjaśniona, z naciskiem na prawidłową formę i bezpieczeństwo.
                        </p>
                    </div>

                    <div class="info-card">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Społeczność</h3>
                        <p>Dołącz do grupy pasjonatów, dziel się swoimi postępami i zdobywaj motywację od innych osób na
                            podobnej drodze.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonial-section">
            <div class="container">
                <h2 class="section-title">Co mówią nasi uczniowie</h2>

                <div class="testimonial">
                    <div class="quote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z">
                            </path>
                            <path
                                d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z">
                            </path>
                        </svg>
                    </div>

                    <p class="testimonial-text">Freestyle Staff Academy zmieniło moje podejście do sztuki flow. Ich
                        metodologia nauki, oparta na powtórzeniach i stopniowym budowaniu pewności siebie, pozwoliła mi
                        opanować triki, o których zawsze marzyłam!</p>

                    <div class="testimonial-author">
                        <img src="" alt="Avatar" class="avatar" />
                        <div class="author-info">
                            <h4>Kasia Kowalska</h4>
                            <p>Praktykuje od 2 lat</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="container">
                <h2>Rozpocznij swoją przygodę z Freestyle Staff już dziś!</h2>
                <p>Dołącz do tysięcy uczniów, którzy przekraczają swoje granice i odkrywają radość płynącą z flow arts.
                </p>
                <router-link to="/dashboard" class="btn btn-primary">Rozpocznij naukę</router-link>
            </div>
        </section>

        <section class="about-creator">
            <div class="container">
                <h2 class="section-title">O twórczyni</h2>

                <div class="creator-profile">
                    <img src="/public/images/academy/MichelleCSmithimg.webp" alt="Zdjęcie twórczyni"
                        class="creator-image" />

                    <div class="creator-info">
                        <h3>Muszka</h3>
                        <p class="creator-title">Założycielka & Główna Instruktorka</p>

                        <p class="creator-bio">
                            Jestem pasjonatką sztuki flow, która od 5 lat zgłębia tajniki Freestyle Staff. Moją misją
                            jest dzielenie się tą niezwykłą sztuką z innymi i pomaganie im w odkrywaniu własnego stylu i
                            potencjału. Wierzę, że praktyka staff spinningu to nie tylko hobby, ale droga do większej
                            świadomości ciała, umysłu i ducha.
                        </p>

                        <div class="creator-socials">
                            <a href="#" class="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" class="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" class="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                                    </path>
                                </svg>
                            </a>
                            <a href="#" class="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z">
                                    </path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const videoPath = '/videos/Freestyle Staff Academy Video.mp4';

const isPlaying = ref(false);

const playVideo = () => {
    isPlaying.value = true;
};
</script>

<style scoped>
.about-academy {
    max-width: 100%;
    margin: 0 auto;
}

.hero-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    padding: 5rem 0 3rem;
    color: white;
    text-align: center;
    border-radius: 0 0 50% 50% / 10%;
    margin-bottom: 3rem;
}

.accent-text {
    color: var(--secondary);
}

.page-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.subtitle {
    font-size: 1.5rem;
    font-weight: 400;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
}

.content-section {
    padding: 2rem 0;
}

.video-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 3rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.video-placeholder {
    width: 100%;
    display: block;
    transition: transform 0.3s ease;
}

.video-container:hover .video-placeholder {
    transform: scale(1.02);
}

.play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: background-color 0.3s ease;
}

.video-container:hover .play-button {
    background-color: var(--secondary);
}

.academy-info {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem auto;
}

.info-card {
    background-color: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.icon {
    width: 60px;
    height: 60px;
    background-color: var(--primary-light);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
}

.info-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--primary);
}

.testimonial-section {
    background-color: #f9f9f9;
    padding: 4rem 0;
    margin: 3rem 0;
}

.section-title {
    text-align: center;
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 2.5rem;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 80px;
    height: 4px;
    background-color: var(--secondary);
    transform: translateX(-50%);
}

.testimonial {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
    padding: 2.5rem;
    position: relative;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.quote {
    position: absolute;
    top: -20px;
    left: 30px;
    color: var(--secondary);
}

.testimonial-text {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    font-style: italic;
}

.testimonial-author {
    display: flex;
    align-items: center;
}

.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 1rem;
    border: 3px solid var(--primary-light);
}

.author-info h4 {
    margin: 0;
    color: var(--primary);
}

.author-info p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.7;
}

.cta-section {
    background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
    color: white;
    text-align: center;
    padding: 5rem 0;
    margin: 3rem 0;
}

.cta-section h2 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
}

.cta-section p {
    max-width: 600px;
    margin: 0 auto 2rem;
    font-size: 1.1rem;
    opacity: 0.9;
}

.btn-primary {
    background-color: white;
    color: var(--primary);
    font-size: 1.1rem;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: inline-block;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.about-creator {
    padding: 4rem 0;
}

.creator-profile {
    display: flex;
    align-items: flex-start;
    max-width: 900px;
    margin: 0 auto;
    gap: 2.5rem;
}

.creator-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 5px solid var(--primary-light);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.creator-info {
    flex: 1;
}

.creator-info h3 {
    font-size: 1.8rem;
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.creator-title {
    font-size: 1.1rem;
    color: var(--secondary);
    margin-bottom: 1.5rem;
}

.creator-bio {
    line-height: 1.8;
    margin-bottom: 1.5rem;
}

.creator-socials {
    display: flex;
    gap: 1rem;
}

.social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.social-link:hover {
    background-color: var(--primary);
    transform: translateY(-3px);
}

@media (max-width: 768px) {
    .academy-info {
        grid-template-columns: 1fr;
    }

    .creator-profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .creator-socials {
        justify-content: center;
    }

    .page-title {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.2rem;
    }

    .hero-section {
        padding: 3rem 0 2rem;
    }

    .testimonial {
        padding: 2rem 1.5rem;
    }

    .quote {
        left: 20px;
    }
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 3rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #000;
}

/* Pozostałe style zostaw bez zmian */
</style>