// Pferde-Huf-Spiel - Spiellogik

class PferdeHufSpiel {
    constructor() {
        // Spielelemente
        this.startScreen = document.getElementById('start-screen');
        this.gameArea = document.getElementById('game-area');
        this.endScreen = document.getElementById('end-screen');
        this.horseshoeContainer = document.getElementById('horseshoe-container');

        // Statistik-Elemente
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.levelDisplay = document.getElementById('level');

        // Endbildschirm-Elemente
        this.finalScoreDisplay = document.getElementById('final-score');
        this.finalLevelDisplay = document.getElementById('final-level');
        this.hitsDisplay = document.getElementById('hits');
        this.missesDisplay = document.getElementById('misses');

        // Spielzustand
        this.score = 0;
        this.level = 1;
        this.hits = 0;
        this.misses = 0;
        this.timeLeft = 60;
        this.isRunning = false;
        this.difficulty = 'easy';

        // Schwierigkeitseinstellungen
        this.difficulties = {
            easy: {
                spawnInterval: 1500,
                lifetime: 2500,
                maxHorseshoes: 3,
                levelUpScore: 100
            },
            medium: {
                spawnInterval: 1000,
                lifetime: 2000,
                maxHorseshoes: 5,
                levelUpScore: 150
            },
            hard: {
                spawnInterval: 700,
                lifetime: 1500,
                maxHorseshoes: 7,
                levelUpScore: 200
            }
        };

        // Timer-Referenzen
        this.gameTimer = null;
        this.spawnTimer = null;

        // SVG für Hufeisen
        this.horseshoeSVG = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 Q10 50 20 25 Q30 5 50 5 Q70 5 80 25 Q90 50 80 80 L70 80 Q75 55 70 35 Q65 20 50 20 Q35 20 30 35 Q25 55 30 80 Z"
                      fill="#8B4513" stroke="#5D3A1A" stroke-width="3"/>
                <circle cx="25" cy="45" r="4" fill="#333"/>
                <circle cx="75" cy="45" r="4" fill="#333"/>
                <circle cx="30" cy="60" r="4" fill="#333"/>
                <circle cx="70" cy="60" r="4" fill="#333"/>
                <circle cx="35" cy="75" r="4" fill="#333"/>
                <circle cx="65" cy="75" r="4" fill="#333"/>
            </svg>
        `;

        this.init();
    }

    init() {
        // Event-Listener für Schwierigkeitsauswahl
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Start-Button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Neustart-Button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.showScreen('start');
        });
    }

    showScreen(screen) {
        this.startScreen.classList.add('hidden');
        this.gameArea.classList.add('hidden');
        this.endScreen.classList.add('hidden');

        switch(screen) {
            case 'start':
                this.startScreen.classList.remove('hidden');
                break;
            case 'game':
                this.gameArea.classList.remove('hidden');
                break;
            case 'end':
                this.endScreen.classList.remove('hidden');
                break;
        }
    }

    startGame() {
        // Spielzustand zurücksetzen
        this.score = 0;
        this.level = 1;
        this.hits = 0;
        this.misses = 0;
        this.timeLeft = 60;
        this.isRunning = true;

        // Anzeigen aktualisieren
        this.updateDisplays();

        // Container leeren
        this.horseshoeContainer.innerHTML = '';

        // Bildschirm wechseln
        this.showScreen('game');

        // Timer starten
        this.startTimers();
    }

    startTimers() {
        const settings = this.difficulties[this.difficulty];

        // Countdown-Timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        // Hufeisen-Spawn-Timer
        this.spawnHorseshoe();
        this.spawnTimer = setInterval(() => {
            if (this.isRunning) {
                this.spawnHorseshoe();
            }
        }, settings.spawnInterval / (1 + (this.level - 1) * 0.1));
    }

    spawnHorseshoe() {
        const settings = this.difficulties[this.difficulty];
        const currentHorseshoes = this.horseshoeContainer.querySelectorAll('.horseshoe:not(.clicked):not(.missed)').length;

        if (currentHorseshoes >= settings.maxHorseshoes) {
            return;
        }

        const horseshoe = document.createElement('div');
        horseshoe.className = 'horseshoe';

        // Zufällige Farbe (mit unterschiedlichen Punktwerten)
        const colors = ['bronze', 'silver', 'golden'];
        const randomColor = colors[Math.floor(Math.random() * 3)];
        horseshoe.classList.add(randomColor);

        // Punktwert basierend auf Farbe
        const pointValues = { bronze: 10, silver: 25, golden: 50 };
        horseshoe.dataset.points = pointValues[randomColor];

        // SVG einfügen
        horseshoe.innerHTML = this.horseshoeSVG;

        // Zufällige Position
        const containerRect = this.horseshoeContainer.getBoundingClientRect();
        const maxX = containerRect.width - 100;
        const maxY = containerRect.height - 100;

        horseshoe.style.left = Math.max(10, Math.random() * maxX) + 'px';
        horseshoe.style.top = Math.max(10, Math.random() * maxY) + 'px';

        // Klick-Event
        horseshoe.addEventListener('click', (e) => {
            if (!horseshoe.classList.contains('clicked') && !horseshoe.classList.contains('missed')) {
                this.hitHorseshoe(horseshoe, e);
            }
        });

        // Zur Container hinzufügen
        this.horseshoeContainer.appendChild(horseshoe);

        // Automatisches Entfernen nach Ablauf
        const lifetime = settings.lifetime / (1 + (this.level - 1) * 0.05);
        setTimeout(() => {
            if (!horseshoe.classList.contains('clicked') && this.isRunning) {
                this.missHorseshoe(horseshoe);
            }
        }, lifetime);
    }

    hitHorseshoe(horseshoe, event) {
        horseshoe.classList.add('clicked');

        const points = parseInt(horseshoe.dataset.points);
        this.score += points * this.level;
        this.hits++;

        // Punkte-Popup anzeigen
        this.showPointsPopup(event.clientX, event.clientY, points * this.level);

        // Level-Up prüfen
        this.checkLevelUp();

        // Anzeigen aktualisieren
        this.updateDisplays();

        // Hufeisen nach Animation entfernen
        setTimeout(() => {
            if (horseshoe.parentNode) {
                horseshoe.remove();
            }
        }, 300);
    }

    missHorseshoe(horseshoe) {
        if (horseshoe.classList.contains('clicked')) return;

        horseshoe.classList.add('missed');
        this.misses++;

        // Nach Animation entfernen
        setTimeout(() => {
            if (horseshoe.parentNode) {
                horseshoe.remove();
            }
        }, 300);
    }

    showPointsPopup(x, y, points) {
        const popup = document.createElement('div');
        popup.className = 'points-popup';
        popup.textContent = '+' + points;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    checkLevelUp() {
        const settings = this.difficulties[this.difficulty];
        const requiredScore = settings.levelUpScore * this.level;

        if (this.score >= requiredScore) {
            this.level++;
            this.levelDisplay.textContent = this.level;

            // Spawn-Rate erhöhen
            clearInterval(this.spawnTimer);
            const newInterval = settings.spawnInterval / (1 + (this.level - 1) * 0.1);
            this.spawnTimer = setInterval(() => {
                if (this.isRunning) {
                    this.spawnHorseshoe();
                }
            }, newInterval);
        }
    }

    updateDisplays() {
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
    }

    endGame() {
        this.isRunning = false;

        // Timer stoppen
        clearInterval(this.gameTimer);
        clearInterval(this.spawnTimer);

        // Übrige Hufeisen entfernen
        this.horseshoeContainer.innerHTML = '';

        // Endstatistik aktualisieren
        this.finalScoreDisplay.textContent = this.score;
        this.finalLevelDisplay.textContent = this.level;
        this.hitsDisplay.textContent = this.hits;
        this.missesDisplay.textContent = this.misses;

        // Endbildschirm anzeigen
        this.showScreen('end');
    }
}

// Spiel initialisieren wenn DOM geladen
document.addEventListener('DOMContentLoaded', () => {
    new PferdeHufSpiel();
});
