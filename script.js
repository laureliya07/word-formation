// Данные
const suffixes = [
    { name: '-ous', color: '#4285F4' },
    { name: '-ful', color: '#FB6D9D' },
    { name: '-y', color: '#F5C542' },
    { name: '-al', color: '#4CAF50' },
    { name: '-ent', color: '#9C27B0' },
    { name: '-ant', color: '#FF9800' },
    { name: '-ive', color: '#00BCD4' }
];

const words = [
    { word: 'beauty', icon: '❤️', correctSuffix: '-ous' },
    { word: 'obey', icon: '👍', correctSuffix: '-ent' },
    { word: 'finance', icon: '💰', correctSuffix: '-al' },
    { word: 'ignore', icon: '❌', correctSuffix: '-ant' },
    { word: 'decide', icon: '✅', correctSuffix: '-ive' },
    { word: 'hesitate', icon: '🤔', correctSuffix: '-ant' },
    { word: 'appear', icon: '👀', correctSuffix: '-ent' },
    { word: 'tolerate', icon: '🤝', correctSuffix: '-ant' },
    { word: 'mystery', icon: '🔍', correctSuffix: '-ous' },
    { word: 'differ', icon: '↔️', correctSuffix: '-ent' },
    { word: 'succeed', icon: '🏆', correctSuffix: '-ful' },
    { word: 'destroy', icon: '💥', correctSuffix: '-ive' },
    { word: 'protect', icon: '🛡️', correctSuffix: '-ive' },
    { word: 'peace', icon: '🕊️', correctSuffix: '-ful' },
    { word: 'hunger', icon: '🍽️', correctSuffix: '-y' },
    { word: 'fog', icon: '🌫️', correctSuffix: '-y' },
    { word: 'origin', icon: '🌱', correctSuffix: '-al' },
    { word: 'poison', icon: '🧪', correctSuffix: '-ous' }
];

// DOM элементы
const columnsContainer = document.getElementById('columns');
const wordBank = document.getElementById('wordBank');
const hintBtn = document.getElementById('hintBtn');
const hintBox = document.getElementById('hintBox');

// Генерация колонок
function createColumns() {
    suffixes.forEach(suffix => {
        const col = document.createElement('div');
        col.className = 'column';

        const header = document.createElement('div');
        header.className = 'column-header';
        header.textContent = suffix.name;

        const body = document.createElement('div');
        body.className = 'column-body';
        body.dataset.suffix = suffix.name;

        // Разрешаем принимать перетаскивание
        body.addEventListener('dragover', e => e.preventDefault());
        body.addEventListener('drop', handleDrop);

        col.appendChild(header);
        col.appendChild(body);
        columnsContainer.appendChild(col);
    });
}

// Генерация слов
function createWords() {
    words.forEach(wordObj => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        wordEl.draggable = true;
        wordEl.dataset.correctSuffix = wordObj.correctSuffix;
        wordEl.innerHTML = `${wordObj.word} <span class="icon">${wordObj.icon}</span>`;

        wordEl.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', wordObj.word);
            wordEl.classList.add('dragging');
        });

        wordEl.addEventListener('dragend', () => {
            wordEl.classList.remove('dragging');
        });

        wordBank.appendChild(wordEl);
    });
}

// Обработчик бросания
function handleDrop(e) {
    e.preventDefault();
    const draggedWord = document.querySelector('.dragging');
    if (!draggedWord) return;

    const targetColumn = e.target.closest('.column-body');
    if (!targetColumn) return;

    const targetSuffix = targetColumn.dataset.suffix;
    const correctSuffix = draggedWord.dataset.correctSuffix;

    // Удаляем слово из банка
    draggedWord.remove();

    // Создаём копию слова в колонке
    const wordCopy = draggedWord.cloneNode(true);
    wordCopy.draggable = false;
    wordCopy.classList.remove('dragging');

    if (targetSuffix === correctSuffix) {
        wordCopy.classList.add('correct');
    } else {
        wordCopy.classList.add('wrong');
    }

    targetColumn.appendChild(wordCopy);

    // Проверяем, все ли слова распределены
    if (document.querySelectorAll('.word').length === 0) {
        alert("🎉 Все слова распределены! Молодец!");
    }
}

// Показать/скрыть подсказку
hintBtn.addEventListener('click', () => {
    if (hintBox.style.display === 'block') {
        hintBox.style.display = 'none';
        hintBtn.textContent = '💡 Показать подсказку';
    } else {
        hintBox.style.display = 'block';
        hintBtn.textContent = '💡 Скрыть подсказку';
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    createColumns();
    createWords();
});