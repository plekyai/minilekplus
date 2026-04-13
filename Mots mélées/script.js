// Game Constants
const GRID_ROWS = 10;
const GRID_COLS = 8;
const WORDS_PER_GAME = 8;
const SCORE_PER_WORD = 100;
const TIME_MALUS_INTERVAL = 5000; // 5 seconds
const MALUS_AMOUNT = 1;

// UI Text Translations
const UI_TEXT = {
    fr: {
        modalTitle: "Choisissez la difficulté",
        easyTitle: "Facile",
        easyDesc: "Les mots vont de gauche à droite, de haut en bas, et en diagonale normale.",
        hardTitle: "Difficile",
        hardDesc: "Les mots peuvent aller dans toutes les directions, même à l'envers !",
        newGame: "🔄 Nouvelle Grille",
        difficulty: "⚙️ Difficulté",
        score: "Score: ",
        win: "Bravo ! Score final : ",
        shareText: "Nouveau jeu de mots mêlés chrétien. Jouez aussi sur"
    },
    en: {
        modalTitle: "Choose Difficulty",
        easyTitle: "Easy",
        easyDesc: "Words go left to right, top to bottom, and normal diagonal.",
        hardTitle: "Hard",
        hardDesc: "Words can go in all directions, even backwards!",
        newGame: "🔄 New Game",
        difficulty: "⚙️ Difficulty",
        score: "Score: ",
        win: "Well done! Final score: ",
        shareText: "New Christian Word Search game. Play now at"
    },
    pt: {
        modalTitle: "Escolha a Dificuldade",
        easyTitle: "Fácil",
        easyDesc: "Palavras vão da esquerda para a direita, de cima para baixo e diagonal normal.",
        hardTitle: "Difícil",
        hardDesc: "Palavras podem ir em todas as direções, até de trás para frente!",
        newGame: "🔄 Novo Jogo",
        difficulty: "⚙️ Dificuldade",
        score: "Pontuação: ",
        win: "Parabéns! Pontuação final: ",
        shareText: "Novo jogo de Caça-Palavras Cristão. Jogue agora em"
    },
    th: {
        modalTitle: "เลือกระดับความยาก",
        easyTitle: "ง่าย",
        easyDesc: "คำศัพท์เรียงจากซ้ายไปขวา บนลงล่าง และแนวทแยงปกติ",
        hardTitle: "ยาก",
        hardDesc: "คำศัพท์สามารถเรียงได้ทุกทิศทาง แม้กระทั่งย้อนกลับ!",
        newGame: "🔄 เกมใหม่",
        difficulty: "⚙️ ความยาก",
        score: "คะแนน: ",
        win: "ยินดีด้วย! คะแนนสุดท้าย: ",
        shareText: "เกมค้นหาคำศัพท์คริสเตียนใหม่ เล่นได้ที่"
    }
};

// Game State
let state = {
    currentLang: 'fr',
    difficulty: 'easy', // 'easy' or 'hard'
    score: 0,
    wordsFound: 0,
    grid: [], // 2D array of letters
    puzzleWords: [], // Array of word objects {text, emoji, found, start: {r,c}, end: {r,c}}
    isSelecting: false,
    selectionStart: null, // {r, c}
    selectionEnd: null, // {r, c}
    timerInterval: null
};

// DOM Elements
const gridContainer = document.getElementById('grid-container');
const wordListContainer = document.getElementById('word-list');
const scoreElement = document.getElementById('score');
const langSelect = document.getElementById('language-select');
const newGameBtn = document.getElementById('new-game-btn');
const changeDiffBtn = document.getElementById('change-diff-btn');
const difficultyModal = document.getElementById('difficulty-modal');

// Initialization
function init() {
    // Event Listeners
    langSelect.addEventListener('change', (e) => {
        state.currentLang = e.target.value;
        updateUIText();
        // If modal is open, it updates text. If game running, maybe restart?
        // Let's restart game if language changes
        if (difficultyModal.classList.contains('hidden')) {
            startNewGame();
        }
    });

    newGameBtn.addEventListener('click', startNewGame);

    changeDiffBtn.addEventListener('click', () => {
        difficultyModal.classList.remove('hidden');
    });

    // Input handling
    gridContainer.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    gridContainer.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Show modal initially
    updateUIText();
    difficultyModal.classList.remove('hidden');
}

// Global function for HTML onclick
window.selectDifficulty = function (diff) {
    state.difficulty = diff;
    difficultyModal.classList.add('hidden');
    startNewGame();
}

function updateUIText() {
    const t = UI_TEXT[state.currentLang] || UI_TEXT.fr;

    document.getElementById('modal-title').textContent = t.modalTitle;
    document.getElementById('easy-title').textContent = t.easyTitle;
    document.getElementById('easy-desc').textContent = t.easyDesc;
    document.getElementById('hard-title').textContent = t.hardTitle;
    document.getElementById('hard-desc').textContent = t.hardDesc;

    // Buttons are now icons, no text update needed
    // newGameBtn.textContent = t.newGame;
    // changeDiffBtn.textContent = t.difficulty;

    // Update score label if needed, but usually we just update the number.
    // Let's update the static part of score board if we had one, but we have "Score: <span...>"
    // We can update the text node before the span
    const scoreParent = scoreElement.parentElement;
    scoreParent.childNodes[0].textContent = t.score;
}

function startNewGame() {
    // Reset State
    clearInterval(state.timerInterval);
    state.score = 0;
    state.wordsFound = 0;
    state.isSelecting = false;
    state.selectionStart = null;
    state.selectionEnd = null;
    updateScoreDisplay();

    // Generate Puzzle
    generatePuzzle();

    // Render
    renderGrid();
    renderWordList();

    // Start Timer
    state.timerInterval = setInterval(() => {
        if (state.score > 0 && state.wordsFound < WORDS_PER_GAME) {
            state.score = Math.max(0, state.score - MALUS_AMOUNT);
            updateScoreDisplay();
        }
    }, TIME_MALUS_INTERVAL);
}

// Grid Generation Algorithm
function generatePuzzle() {
    // 1. Select Words
    const allWords = WORD_BANK[state.currentLang];
    // Shuffle and pick WORDS_PER_GAME
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, WORDS_PER_GAME).map(w => {
        let cleanText;
        if (state.currentLang === 'th') {
            // For Thai, keep the text as is, just remove whitespace if any
            cleanText = w.text.replace(/\s+/g, '');
        } else {
            // For Latin languages, normalize and keep only A-Z
            cleanText = w.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
        }
        return {
            ...w,
            found: false,
            cleanText: cleanText
        };
    });

    // 2. Initialize Grid
    const grid = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(''));

    // 3. Place Words
    selectedWords.sort((a, b) => b.cleanText.length - a.cleanText.length);

    // Define Directions based on Difficulty
    let directions;
    if (state.difficulty === 'easy') {
        directions = [
            { dr: 0, dc: 1 },  // Horizontal Right (→)
            { dr: 1, dc: 0 },  // Vertical Down (↓)
            { dr: 1, dc: 1 }   // Diagonal Down-Right (↘)
        ];
    } else {
        // Hard: All 8 directions
        directions = [
            { dr: 0, dc: 1 },   // →
            { dr: 0, dc: -1 },  // ←
            { dr: 1, dc: 0 },   // ↓
            { dr: -1, dc: 0 },  // ↑
            { dr: 1, dc: 1 },   // ↘
            { dr: 1, dc: -1 },  // ↙
            { dr: -1, dc: 1 },  // ↗
            { dr: -1, dc: -1 }  // ↖
        ];
    }

    for (let wordObj of selectedWords) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const word = wordObj.cleanText;

            // Random start position
            const startR = Math.floor(Math.random() * GRID_ROWS);
            const startC = Math.floor(Math.random() * GRID_COLS);

            // Check bounds
            const endR = startR + dir.dr * (word.length - 1);
            const endC = startC + dir.dc * (word.length - 1);

            if (endR < 0 || endR >= GRID_ROWS || endC < 0 || endC >= GRID_COLS) continue;

            // Check collisions
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const r = startR + dir.dr * i;
                const c = startC + dir.dc * i;
                const cell = grid[r][c];
                if (cell !== '' && cell !== word[i]) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                // Place it
                for (let i = 0; i < word.length; i++) {
                    const r = startR + dir.dr * i;
                    const c = startC + dir.dc * i;
                    grid[r][c] = word[i];
                }
                wordObj.start = { r: startR, c: startC };
                wordObj.end = { r: endR, c: endC };
                placed = true;
            }
        }

        if (!placed) {
            console.warn(`Could not place word: ${wordObj.text}`);
        }
    }

    // 4. Fill Empty Spaces
    const alphabet = ALPHABETS[state.currentLang];
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    state.grid = grid;
    state.puzzleWords = selectedWords.filter(w => w.start); // Only keep placed words
}

// Rendering
function renderGrid() {
    gridContainer.innerHTML = '';
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = state.grid[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;
            gridContainer.appendChild(cell);
        }
    }
}

function renderWordList() {
    wordListContainer.innerHTML = '';
    state.puzzleWords.forEach(word => {
        const item = document.createElement('div');
        item.className = `word-item ${word.found ? 'found' : ''}`;

        const textSpan = document.createElement('div');
        textSpan.className = 'word-text';
        textSpan.innerHTML = `<span class="emoji">${word.emoji}</span> <span>${word.text}</span>`;

        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn';
        audioBtn.innerHTML = '🔊';
        audioBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering other clicks
            speak(word.text, audioBtn);
        };

        item.appendChild(textSpan);
        item.appendChild(audioBtn);
        wordListContainer.appendChild(item);
    });
}

function updateScoreDisplay() {
    scoreElement.textContent = state.score;
}

// Interaction Logic
function handlePointerDown(e) {
    if (!e.target.classList.contains('cell')) return;
    e.preventDefault(); // Prevent text selection
    state.isSelecting = true;
    const r = parseInt(e.target.dataset.r);
    const c = parseInt(e.target.dataset.c);
    state.selectionStart = { r, c };
    state.selectionEnd = { r, c };
    highlightSelection();
}

function handlePointerMove(e) {
    if (!state.isSelecting) return;

    // Get element under pointer
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && target.classList.contains('cell')) {
        const r = parseInt(target.dataset.r);
        const c = parseInt(target.dataset.c);

        const start = state.selectionStart;
        let endR = r;
        let endC = c;

        // Snap to valid lines (Horizontal, Vertical, Diagonal)
        const dr = r - start.r;
        const dc = c - start.c;
        const absDr = Math.abs(dr);
        const absDc = Math.abs(dc);

        if (absDr === 0) {
            // Horizontal
            endR = start.r;
            endC = c;
        } else if (absDc === 0) {
            // Vertical
            endR = r;
            endC = start.c;
        } else if (absDr === absDc) {
            // Perfect Diagonal
            endR = r;
            endC = c;
        } else {
            // Not aligned, snap to closest
            // If closer to H
            if (absDr < absDc / 2) {
                endR = start.r;
                endC = c;
            }
            // If closer to V
            else if (absDc < absDr / 2) {
                endR = r;
                endC = start.c;
            }
            // Else snap to diagonal
            else {
                const signDr = Math.sign(dr);
                const signDc = Math.sign(dc);
                const dist = Math.min(absDr, absDc);
                endR = start.r + signDr * dist;
                endC = start.c + signDc * dist;
            }
        }

        // Check bounds for snapped coordinates
        endR = Math.max(0, Math.min(GRID_ROWS - 1, endR));
        endC = Math.max(0, Math.min(GRID_COLS - 1, endC));

        state.selectionEnd = { r: endR, c: endC };
        highlightSelection();
    }
}

function handlePointerUp(e) {
    if (!state.isSelecting) return;
    state.isSelecting = false;
    checkSelection();
    clearSelectionHighlight();
}

function highlightSelection() {
    // Clear previous temporary highlights (not found ones)
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));

    const cells = getCellsInSelection();
    cells.forEach(pos => {
        const cell = getCellElement(pos.r, pos.c);
        if (cell) cell.classList.add('selected');
    });
}

function clearSelectionHighlight() {
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
}

function getCellsInSelection() {
    const start = state.selectionStart;
    const end = state.selectionEnd;
    const cells = [];

    if (!start || !end) return cells;

    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);

    // If start == end
    if (dr === 0 && dc === 0) {
        cells.push(start);
        return cells;
    }

    let currR = start.r;
    let currC = start.c;

    // Safety break
    let steps = 0;
    // We use a loop that goes until we hit the end or exceed bounds
    // Since we snapped, we should hit end exactly.
    const totalSteps = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c));

    for (let i = 0; i <= totalSteps; i++) {
        cells.push({ r: currR, c: currC });
        currR += dr;
        currC += dc;
    }

    return cells;
}

function getCellElement(r, c) {
    return gridContainer.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function checkSelection() {
    const selectedCells = getCellsInSelection();
    const selectedWord = selectedCells.map(pos => state.grid[pos.r][pos.c]).join('');

    // Check against puzzle words
    // Check forward and reverse
    const foundWordObj = state.puzzleWords.find(w =>
        !w.found && (w.cleanText === selectedWord || w.cleanText === selectedWord.split('').reverse().join(''))
    );

    if (foundWordObj) {
        // Valid word found!
        foundWordObj.found = true;
        state.score += SCORE_PER_WORD;
        state.wordsFound++;
        updateScoreDisplay();

        selectedCells.forEach(pos => {
            const cell = getCellElement(pos.r, pos.c);
            if (cell) cell.classList.add('found');
        });

        // Update word list UI
        renderWordList();

        // Play sound - REMOVED as per user request (only on button click)
        // speak(foundWordObj.text);

        // Check Win
        if (state.wordsFound === state.puzzleWords.length) {
            setTimeout(() => {
                showVictoryModal();
            }, 500);
        }
    }
}

// Victory Modal Logic
function showVictoryModal() {
    const modal = document.getElementById('victory-modal');
    const grid = document.getElementById('victory-words-grid');

    // Populate words
    grid.innerHTML = '';
    state.puzzleWords.forEach(word => {
        const div = document.createElement('div');
        div.className = 'victory-word-item';
        div.innerHTML = `<span class="emoji">${word.emoji}</span> <span>${word.text}</span>`;
        grid.appendChild(div);
    });

    modal.classList.remove('hidden');
}

window.closeVictoryModal = function () {
    document.getElementById('victory-modal').classList.add('hidden');
}

// Event listeners for victory modal buttons
document.getElementById('replay-btn').addEventListener('click', () => {
    closeVictoryModal();
    startNewGame();
});

document.getElementById('lang-btn').addEventListener('click', () => {
    closeVictoryModal();
    document.getElementById('language-select').focus();
    // Optional: highlight language selector
});

document.getElementById('share-btn').addEventListener('click', () => {
    const t = UI_TEXT[state.currentLang] || UI_TEXT.fr;
    const shareUrl = "https://minilek.com/jeux/mots-melees/index.html";
    const text = `${t.shareText} ${shareUrl}`;

    if (navigator.share) {
        navigator.share({
            title: 'Minilek Wordsearch',
            text: text,
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback
        navigator.clipboard.writeText(text);
        alert("Lien copié dans le presse-papier !");
    }
});

// Audio System
function speak(text, btnElement = null) {
    if (!window.speechSynthesis) return;

    // Cancel current
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language codes
    const langMap = {
        'fr': 'fr-FR',
        'en': 'en-US',
        'pt': 'pt-BR',
        'th': 'th-TH'
    };
    utterance.lang = langMap[state.currentLang] || 'en-US';

    if (btnElement) {
        btnElement.classList.add('playing');
        utterance.onend = () => btnElement.classList.remove('playing');
    }

    window.speechSynthesis.speak(utterance);
}

// Start
init();
