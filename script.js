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

// Слова с иконками и правильными суффиксами (по подсказке)
const words = [
    { word: 'origin', icon: '🌱', correctSuffix: '-al' },
    { word: 'humour', icon: '😂', correctSuffix: '-ous' },
    { word: 'beauty', icon: '❤️', correctSuffix: '-ful' },
    { word: 'finance', icon: '💰', correctSuffix: '-al' },
    { word: 'appear', icon: '👀', correctSuffix: '-ent' }, // apparent → -ant, но в подсказке нет — оставим -ent

    { word: 'benefit', icon: '📈', correctSuffix: '-al' }, // beneficial
    { word: 'protect', icon: '🛡️', correctSuffix: '-ive' }, // protective
    { word: 'mystery', icon: '🔍', correctSuffix: '-ous' }, // mysterious
    { word: 'tolerate', icon: '🤝', correctSuffix: '-ant' }, // tolerant

    { word: 'hunger', icon: '🍽️', correctSuffix: '-y' }, // hungry
    { word: 'ignore', icon: '❌', correctSuffix: '-ant' }, // ignorant
    { word: 'differ', icon: '↔️', correctSuffix: '-ent' }, // different
    { word: 'poison', icon: '🧪', correctSuffix: '-ous' }, // poisonous
    { word: 'peace', icon: '☮️', correctSuffix: '-ful' }, // peaceful

    { word: 'obey', icon: '👍', correctSuffix: '-ent' }, // obedient
    { word: 'decide', icon: '✅', correctSuffix: '-ive' }, // decisive
    { word: 'cloud', icon: '☁️', correctSuffix: '-y' }, // cloudy
    { word: 'create', icon: '🎨', correctSuffix: '-ive' }, // creative — заменили destroy

    { word: 'hesitate', icon: '🤔', correctSuffix: '-ant' }, // hesitant
    { word: 'fog', icon: '🌫️', correctSuffix: '-y' }, // foggy
    { word: 'succeed', icon: '🏆', correctSuffix: '-ful' } // successful
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
        body.addEventListener('drop', handleDrop);

        col.appendChild(header);
        col.appendChild(body);
        columnsContainer.appendChild(col);

        // Инициализируем массив слов для этой колонки
        columnWords[suffix.name] = [];
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

    // Добавляем возможность перетащить обратно
    wordCopy.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', wordCopy.dataset.word);
        wordCopy.classList.add('dragging');
    });

    wordCopy.addEventListener('dragend', () => {
        wordCopy.classList.remove('dragging');
    });

    // Запоминаем, в какой колонке оно сейчас
    wordCopy.dataset.actualSuffix = targetSuffix;

    targetColumn.appendChild(wordCopy);

    // Добавляем в массив
    columnWords[targetSuffix].push({
        word: wordCopy.dataset.word,
        correctSuffix: correctSuffix,
        actualSuffix: targetSuffix,
        element: wordCopy
    });

    // Проверяем, все ли слова распределены
    if (document.querySelectorAll('.word').length === 0) {
        alert("🎉 Все слова распределены! Можешь нажать «Проверить».");
    }
}

// Проверка
checkBtn.addEventListener('click', () => {
    // Сбрасываем предыдущие стили
    document.querySelectorAll('.column-body .word').forEach(el => {
        el.classList.remove('correct', 'wrong');
    });

    let allCorrect = true;

    // Проверяем каждое слово
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