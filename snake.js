const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Загружаем фоновое изображение
const backgroundImage = new Image();
backgroundImage.src = 'bg1.jpg';


const box = 20; // Размер блока
let snake = [{ x: 9 * box, y: 9 * box }]; // Начальная позиция змейки
let direction; // Направление движения
let food; // Позиция еды
let score = 0; // Счет
let speed = 150; // Начальная скорость (мс)
let eatenCount = 0; // Счетчик съеденных букв


let eatenLetters = []; // Массив съеденных букв

// Функция для увеличения скорости
function increaseSpeed() {
    speed = Math.max(10, speed - 19); // Увеличиваем скорость 
    clearInterval(game); // Останавливаем текущий игровой цикл
    game = setInterval(draw, speed); // Запускаем новый игровой цикл с новой скоростью
    console.log(speed, eatenCount)
}

// Массив с буквами английского алфавита
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ8903'.split('');
// Объект для хранения аудиофайлов
const audioFiles = {
    A: new Audio('/sounds//a.mp3'),
    B: new Audio('/sounds//b.mp3'),
    C: new Audio('/sounds//c.mp3'),
    D: new Audio('/sounds//d.mp3'),
    E: new Audio('/sounds//e.mp3'),
    F: new Audio('/sounds//f.mp3'),
    G: new Audio('/sounds//g.mp3'),
    H: new Audio('/sounds//h.mp3'),
    I: new Audio('/sounds//i.mp3'),
    J: new Audio('/sounds//j.mp3'),
    K: new Audio('/sounds//k.mp3'),
    L: new Audio('/sounds//l.mp3'),
    M: new Audio('/sounds//m.mp3'),
    N: new Audio('/sounds//n.mp3'),
    O: new Audio('/sounds//o.mp3'),
    P: new Audio('/sounds//p.mp3'),
    Q: new Audio('/sounds//q.mp3'),
    R: new Audio('/sounds//r.mp3'),
    S: new Audio('/sounds//s.mp3'),
    T: new Audio('/sounds//t.mp3'),
    U: new Audio('/sounds//u.mp3'),
    V: new Audio('/sounds//v.mp3'),
    W: new Audio('/sounds//w.mp3'),
    X: new Audio('/sounds//x.mp3'),
    Y: new Audio('/sounds//y.mp3'),
    Z: new Audio('/sounds//z.mp3'),
    9: new Audio('/sounds//9.mp3'),
    8: new Audio('/sounds//8.mp3'),
    0: new Audio('/sounds//0.mp3'),
    3: new Audio('/sounds//3.mp3'),
    // Добавьте остальные буквы...
};
function playSound(letter) {
    if (audioFiles[letter]) {
        audioFiles[letter].currentTime = 0; // Сбрасываем время воспроизведения
        audioFiles[letter].play(); // Воспроизводим звук
        console.log("played sound")
    }
}


// Функция для генерации случайной буквы
function getRandomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
}

// Генерация начальной еды
food = {
    x: Math.floor(Math.random() * (canvas.width / box - 1)) * box,
    y: Math.floor(Math.random() * (canvas.height / box - 1)) * box,
    letter: getRandomLetter() // Генерируем новую букву
};



// Функция для рисования прямоугольников с закругленными углами
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    return this;
};

// Управление стрелками и WASD
document.addEventListener('keydown', directionControl);

function directionControl(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'ф') {
        if (direction !== 'RIGHT') direction = 'LEFT';
    } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'ц') {
        if (direction !== 'DOWN') direction = 'UP';
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'в') {
        if (direction !== 'LEFT') direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'ы') {
        if (direction !== 'UP') direction = 'DOWN';
    }
}

// Обработчики событий для кнопок
document.getElementById('up').addEventListener('click', function() {
    if (direction !== 'DOWN') direction = 'UP';
});
document.getElementById('down').addEventListener('click', function() {
    if (direction !== 'UP') direction = 'DOWN';
});
document.getElementById('left').addEventListener('click', function() {
    if (direction !== 'RIGHT') direction = 'LEFT';
});
document.getElementById('right').addEventListener('click', function() {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

// Функция для генерации еды
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box - 1)) * box,
            y: Math.floor(Math.random() * (canvas.height / box - 1)) * box,
            letter: getRandomLetter()
        };
    } while (collision(newFood, snake)); // Проверяем, не занята ли позиция змейкой
    return newFood;
}


// Проверка столкновений
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}
// Основной игровой цикл
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Рисуем фоновое изображение
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, 600, 400);

    // Рисуем фон с закругленными краями
    // ctx.fillStyle = '#f0f0f0'; // Цвет фона
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20); // Прямоугольник с закругленными углами
    // ctx.fill(); // Заполняем цветом

    // Рисуем еду


    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
    ctx.fillStyle = 'white'; // Цвет буквы
    ctx.font = '16px Arial';
    ctx.fillText(food.letter, food.x + 5, food.y + 15); // Рисуем букву

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen'; // Голова змейки
        ctx.roundRect(snake[i].x, snake[i].y, box, box, 5); // Рисуем прямоугольник с закругленными углами
        ctx.fill(); // Заполняем цветом

        ctx.strokeStyle = 'black'; // Контур
        ctx.roundRect(snake[i].x, snake[i].y, box, box, 5); // Рисуем контур
        ctx.stroke(); // Обводим контур
    }

    // Движение змейки
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Проверка на поедание еды
    if (snakeX === food.x && snakeY === food.y) {
        score++; // Увеличиваем счет
        eatenCount++;
        eatenLetters.push(food.letter); // Добавляем букву в массив съеденных букв
        // Воспроизводим звук для съеденной буквы
        playSound(food.letter);
        // Генерируем новую еду
        food = generateFood();
        // Проверка на увеличение скорости
        if (eatenCount % 3 === 0) {
            increaseSpeed();
        }
        document.getElementById('letterContainer').innerText = eatenLetters.join(', '); // Обновляем контейнер
    } else {
        snake.pop(); // Удаляем последний элемент, если не съели еду
    }
    

    // Добавляем новый элемент в начало змейки
    const newHead = { x: snakeX, y: snakeY };

    // Проверка на столкновение со стенами с запасом в 1 блок
    if (snakeX < -box || snakeY < -box || snakeX >= canvas.width + box || snakeY >= canvas.height + box) {
        clearInterval(game);
        alert('Игра окончена! Вы сожрали: ' + score + ' letters');
    }


    // Проверка столкновения с телом змейки
    if (collision(newHead, snake)) {
        clearInterval(game);
        alert('Игра окончена! Вы сожрали: ' + score + ' letters');
    }
    snake.unshift(newHead); // Добавляем новую голову

    // Отображаем счет
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('you ate : ' + score, 10, 20);
}



// Запускаем игру с интервалом в 100 миллисекунд
let game = setInterval(draw, speed);
