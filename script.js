// Данные — суффиксы
const suffixes = [
    { name: '-ous', color: '#4285F4' },
    { name: '-ful', color: '#FB6D9D' },
    { name: '-y', color: '#F5C542' },
    { name: '-al', color: '#4CAF50' },
    { name: '-ent', color: '#9C27B0' },
    { name: '-ant', color: '#FF9800' },
    { name: '-ive', color: '#00BCD4' }
];

// Слова с иконками и правильными прилагательными (по подсказке)
const words = [
    { word: 'mystery', icon: '🔍', adjective: 'mysterious', suffix: '-ous' },
    { word: 'poison', icon: '🧪', adjective: 'poisonous', suffix: '-ous' },
    { word: 'humour', icon: '😂', adjective: 'humorous', suffix: '-ous' },

    { word: 'beauty', icon: '❤️', adjective: 'beautiful', suffix: '-ful' },
    { word: 'succeed', icon: '🏆', adjective: 'successful', suffix: '-ful' },
    { word: 'peace', icon: '☮️', adjective: 'peaceful', suffix: '-ful' },

    { word: 'cloud', icon: '☁️', adjective: 'cloudy', suffix: '-y' },
    { word: 'fog', icon: '🌫️', adjective: 'foggy', suffix: '-y' },
    { word: 'hunger', icon: '🍽️', adjective: 'hungry', suffix: '-y' },

    { word: 'finance', icon: '💰', adjective: 'financial', suffix: '-al' },
    { word: 'benefit', icon: '📈', adjective: 'beneficial', suffix: '-al' },
    { word: 'origin', icon: '🌱', adjective: 'original', suffix: '-al' },

    { word: 'differ', icon: '↔️', adjective: 'different', suffix: '-ent' },
    { word: 'obey', icon: '👍', adjective: 'obedient', suffix: '-ent' },
    { word: 'dependent', icon: '🔗', adjective: 'dependent', suffix: '-ent' }, // ❗ заменили "appear"

    { word: 'hesitate', icon: '🤔', adjective: 'hesitant', suffix: '-ant' },
    { word: 'tolerate', icon: '🤝', adjective: 'tolerant', suffix: '-ant' },
    { word: 'important', icon: '❗', adjective: 'important', suffix: '-ant' }, // ❗ заменили "ignore"

    { word: 'decide', icon: '✅', adjective: 'decisive', suffix: '-ive' },
    { word: 'active', icon: '⚡', adjective: 'active', suffix: '-ive' }, // ❗ заменили "create"
    { word: 'protect', icon: '🛡️', adjective: 'protective', suffix: '-ive' }
];

// DOM элементы
const columnsContainer = document.getElementById('columns');
const wordBank = document.getElementById('wordBank');
const hintBtn = document.getElementById('hintBtn');
const hintBox = document.getElementById('hintBox');
const checkBtn = document.getElementById('checkBtn');

// Для хранения текущих слов в колонках
let columnWords = {};

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
        body.addEventListener('drop', handleDropToColumn);

        col.appendChild(header);
        col.appendChild(body);
        columnsContainer.appendChild(col);

        // Инициализируем массив слов для этой колонки
        columnWords[suffix.name] = [];
    });
}

// Делаем банк приёмником перетаскивания
wordBank.addEventListener('dragover', e => {
    e.preventDefault();
});
wordBank.addEventListener('drop', handleDropToBank);

// Генерация слов
function createWords() {
    words.forEach(wordObj => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        wordEl.draggable = true;
        wordEl.dataset.adjective = wordObj.adjective;
        wordEl.dataset.suffix = wordObj.suffix;
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

// Обработчик бросания в колонку
function handleDropToColumn(e) {
    e.preventDefault();
    const draggedWord = document.querySelector('.dragging');
    if (!draggedWord) return;

    const targetColumn = e.target.closest('.column-body');
    if (!targetColumn) return;

    const targetSuffix = targetColumn.dataset.suffix;
    const correctSuffix = draggedWord.dataset.suffix;
    const adjective = draggedWord.dataset.adjective;

    // Удаляем слово из текущего места
    draggedWord.remove();

    // Создаём копию слова в колонке
    const wordCopy = draggedWord.cloneNode(true);
    wordCopy.draggable = true;
    wordCopy.classList.remove('dragging');

    // Добавляем обработчики
    wordCopy.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', wordCopy.dataset.word);
        wordCopy.classList.add('dragging');
    });
    wordCopy.addEventListener('dragend', () => {
        wordCopy.classList.remove('dragging');
    });

    wordCopy.dataset.actualSuffix = targetSuffix;

    targetColumn.appendChild(wordCopy);

    // Обновляем данные
    columnWords[targetSuffix].push({
        word: wordCopy.dataset.word,
        adjective: adjective,
        correctSuffix: correctSuffix,
        actualSuffix: targetSuffix,
        element: wordCopy
    });
}

// Обработчик бросания в банк
function handleDropToBank(e) {
    e.preventDefault();
    const draggedWord = document.querySelector('.dragging');
    if (!draggedWord) return;

    // Удаляем слово из текущего места
    draggedWord.remove();

    // Восстанавливаем исходный вид
    const wordCopy = draggedWord.cloneNode(true);
    wordCopy.draggable = true;
    wordCopy.classList.remove('dragging');

    wordCopy.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', wordCopy.dataset.word);
        wordCopy.classList.add('dragging');
    });
    wordCopy.addEventListener('dragend', () => {
        wordCopy.classList.remove('dragging');
    });

    wordBank.appendChild(wordCopy);

    // Удаляем из columnWords
    const actualSuffix = draggedWord.dataset.actualSuffix;
    if (actualSuffix && columnWords[actualSuffix]) {
        columnWords[actualSuffix] = columnWords[actualSuffix].filter(item => item.element !== draggedWord);
    }
}

// Проверка
checkBtn.addEventListener('click', () => {
    // Сбрасываем предыдущие стили
    document.querySelectorAll('.column-body .word').forEach(el => {
        el.classList.remove('correct', 'wrong');
    });

    let allCorrect = true;

    Object.keys(columnWords).forEach(suffix => {
        columnWords[suffix].forEach(item => {
            if (item.correctSuffix === item.actualSuffix) {
                item.element.classList.add('correct');
            } else {
                item.element.classList.add('wrong');
                allCorrect = false;
            }
        });
    });

    if (allCorrect) {
        alert("🎉 Все слова распределены правильно!");
    } else {
        alert("⚠️ Есть ошибки. Попробуй ещё раз!");
    }
});

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
