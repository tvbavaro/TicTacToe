class TicTacToe {
    constructor() {
        this.user = 'X'; // текущий игрок
        this.winX = 0; // побед игрока Х
        this.winO = 0; // побед игрока О
        this.rules = [ // двумерный массив выигрышных клеток
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.sessionId = this.generateSessionId(); // переменная для хранения sessionId
        this.writeSessionIdinSessionStorage(this.sessionId);
        this.roundFinish = false; // если есть победитель или ничья флаг true
        this.plaingField = this.initPlaingField(); // массив хранит все текущие ХО на поле
        this.printPlaingField(this.plaingField);
        this.initButtons();
        this.printScore();
        this.firstAnimation();
        this.compareSessionId(this.sessionId);
    }


    initPlaingField() { // обнуляет массив текущих значений ХО на поле

        let defaultField = [];
        if (this.roundFinish) {
            for (let i = 8; i > -1; i--) {
                defaultField[i] = '';
            }
        } else {
            defaultField = [...document.querySelectorAll('.element')].map(button => button.innerText);
        }

        return defaultField;
    }

    updatePlaingField(button) { // обновляет массив на каждом ходе

        if (this.roundFinish) {
            this.plaingField = this.initPlaingField();
            this.roundFinish = false;
            this.winnerBlock();
            this.winnerCells();
        }

        let index = button.classList[1].split('-')[1];
        button.innerText = this.user;
        this.plaingField[index] = button.innerText;
    }

    initButtons() { // добавляет click на кнопки при загрузке поля
        document.querySelectorAll('.element')
            .forEach(button => button.addEventListener('click', (e) => {
                this.addSumbol(e.target);
            }));
    }

    printPlaingField(field) { // отрисовывает данные на странице из массива ХО
        document.querySelectorAll('.element')
            .forEach(el => el.innerText = field[+el.classList[1].split('-')[1]] || '');

    }

    printScore() { // отрисовывает данные в поле данных
        document.querySelector('.whose-step').innerText = `Stroke ${this.user}`;
        document.querySelector('.score').innerText = `X wins: ${this.winX} | O wins: ${this.winO}`;
    }

    checkContainer(container) { // проверяет возможность добавления ХО в поле
        if (!container.innerText || this.roundFinish) {
            return true;
        } else {
            alert('Can\'t use this container');
            return false;
        }
    }

    _whoseStep() { // устанавливает ход следующего игрока
        switch (this.user) {
            case 'X':
                this.user = 'O';
                break;
            case 'O':
                this.user = 'X';
                break;
            default:
                console.log('change user error');
        }
    }

    whoseWin() { // определяет победителя на каждом ходу

        for (let i = 7; i > -1; i--) {
            if (this.plaingField[this.rules[i][0]] ===
                this.plaingField[this.rules[i][1]] &&
                this.plaingField[this.rules[i][1]] ===
                this.plaingField[this.rules[i][2]] &&
                this.plaingField[this.rules[i][0]] !== '') {
                this.roundFinish = true;
                this.counterWin();
                this.winnerBlock(`Winner is ${this.user}`);
                this.winnerCells(this.rules[i]);
                break;
            }
        }

        if (!this.plaingField.includes('') && !this.roundFinish) {
            this.winnerBlock('Dead Head');
            this.roundFinish = true;
        }
    }

    winnerBlock(text) { // отрисовывает блок при наличии победителя
        if (document.querySelector('.winner').classList.contains('have-winner')) {
            document.querySelector('.winner').classList.remove('have-winner');
            document.querySelector('.whose-step').classList.remove('transparent-font');
        } else {
            let winnerBlock = document.querySelector('.winner');
            winnerBlock.classList.add('have-winner');
            winnerBlock.innerText = text;
            document.querySelector('.whose-step').classList.add('transparent-font');
        }
    }

    winnerCells(cells) { // подкрашивает выигрышую комбинацию клеток
        setTimeout(() => {
            if (this.roundFinish && cells.length) {
                for (let i = 2; i > -1; i--) {
                    document.querySelector(`.cell-${cells[i]}`).classList.add('winner-cell');
                }
            } else {
                document.querySelectorAll('.winner-cell')
                    .forEach(cell => cell.classList.remove('winner-cell'));
            }
        }, 100);
    }

    counterWin() { // считает кол-во побед каждого игрока
        switch (this.user) {
            case 'X':
                this.winX++;
                break;
            case 'O':
                this.winO++;
                break;
            default:
                console.log('add win error');
        }
    }

    addSumbol(button) { // срабатывает на кадом ходу и вызывает последовательность функций

        if (this.checkContainer(button)) {
            this.updatePlaingField(button);
            this.whoseWin();
            this._whoseStep();
            this.printPlaingField(this.plaingField);
            this.printScore();
            this.writeDataInSessionStorage();
        }
    }


    generateSessionId() { // генерирует sessionId
        const sessionId = Math.round(
            100000 - 0.5 + Math.random() * (99999999999 - 100000 + 1)
        );
        return sessionId;
    }

    writeSessionIdinSessionStorage(sessionId) { // записывает номер текущей сессии в sessionStorage
        const sessionStorageSessionId = JSON.parse(sessionStorage.getItem('ticTacToeSessionId'));
        if (!sessionStorageSessionId) {
            sessionStorage.setItem('ticTacToeSessionId', JSON.stringify(sessionId));
        }
    }


    deleteSessionIdFromSessionStorage() { // удаляет номер текущей сессии из sessionStorage
        sessionStorage.removeItem('ticTacToeSessionId');
    }

    compareSessionId(localSessionId) { // сравнения sessionId объекта и sessionStorage
        const sessionStorageSessionId = JSON.parse(sessionStorage.getItem('ticTacToeSessionId'));
        const sessionId = localSessionId;
        if (sessionStorageSessionId != sessionId) {
            this.createModal();
            return false;
        } else return true;
    }


    createModal() { // создает модальное окно и кнопки для выбора загрузки предыдущей игры

        const modal = document.createElement('div');
        modal.classList.add('modal-window');
        document.querySelector('.container').append(modal);
        setTimeout(() => {
            modal.classList.add('modal-animation');
        }, 800);

        const header = document.createElement('h3');
        header.innerText = 'Load previous game?';
        header.classList.add('h3');
        modal.append(header);

        const buttonContainer = document.createElement('div');
        modal.append(buttonContainer);

        const buttonYes = document.createElement('button');
        const buttonNo = document.createElement('button');
        buttonYes.classList.add('modal-button');
        buttonYes.style.color = 'aqua';
        buttonNo.classList.add('modal-button');
        buttonYes.innerText = 'YES';
        buttonNo.innerText = 'NO';

        buttonContainer.append(buttonYes);
        buttonContainer.append(buttonNo);

        buttonYes.addEventListener('click', () => {
            this.deleteModal();
            this.reWriteSessionId();
            this.loadGame();

        });
        buttonNo.addEventListener('click', () => {
            this.deleteModal();
            this.reWriteSessionId();
        });

    }

    deleteModal() { // удаляет модальное окно
        const modal = document.querySelector('.modal-window')
        modal.classList.remove('modal-animation');
        setTimeout(() => {
            modal.remove();
        }, 1000)
    }

    reWriteSessionId() { // сохраняет в текущую переменную номер сессии из sessionStorage
        this.sessionId = JSON.parse(sessionStorage.getItem('ticTacToeSessionId'));
    }


    writeDataInSessionStorage() { // записывает все данные игры в sessionStorage
        setTimeout(() => {
            let obj = {};
            obj.player = this.user;
            obj.winX = this.winX;
            obj.winO = this.winO;
            obj.roundFinish = this.roundFinish;
            obj.plaingField = this.plaingField.map(el => el.outerHTML);
            obj.container = document.querySelector('.container').outerHTML;

            sessionStorage.setItem('ticTacToeGameData', JSON.stringify(obj));
        }, 100);

    }


    loadGame() { // загружает сохраненную игру из sessionStorage
        setTimeout(() => {
            const gameData = JSON.parse(sessionStorage.getItem('ticTacToeGameData'));
            this.user = gameData.player;
            this.winX = gameData.winX;
            this.winO = gameData.winO;
            this.roundFinish = gameData.roundFinish;
            document.querySelector('.container').outerHTML = gameData.container;

            this.plaingField = this.initPlaingField();
            this.initButtons();
        }, 1000);
    }


    firstAnimation() { // загрузка первой анимации появления кнопок
        document.querySelectorAll('.element').forEach(button => {
            button.classList.add('transition2s');
            button.classList.add('element-shadow');
        })

        setTimeout(() => {
            document.querySelectorAll('.element').forEach(button => {
                button.classList.remove('transition2s');
                button.classList.add('transition02s');
            })
        }, 100);
    }
}

const ticTacToe = new TicTacToe();