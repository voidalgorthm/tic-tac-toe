function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Player = (sign, sentient) => {
    let _sign = sign;
    let _sentient = sentient;
    const getSign = () => _sign;
    const getSentient = () => _sentient;
    const setSign = (sign, sentient = false) => {
        _sign = sign;
        _sentient = sentient;
        const buttons = document.querySelectorAll('button.btn-faction');
        buttons.forEach(button => {
            if (button.value === sign) {
                if (sentient) button.classList.add('selected');
                else button.classList.remove('selected');
            }
        });
    }
    return {
        getSign,
        getSentient,
        setSign
    }
}

const gameBoard = (() => {
    let _board = [...Array(9)];
    const getTiles = (num) => _board[num];
    const getBoard = () => _board;
    const setTiles = (num, player) => {
        const gameTiles = document.querySelectorAll(`button.btn-game`);
        const gameTile = gameTiles.item(`${num + 1})`);
        console.log(gameTile);
        // gameTile.classList.add('marked');
        gameTile.textContent = player.getSign();
        _board[num] = player.getSign();
        gameTile.setAttribute('disabled', true);
    }

    const clearTiles = () => {
        _board = _board.map(tile => tile = undefined);
    }

    return {
        getTiles,
        setTiles,
        clearTiles,
        getBoard
    };
})();

const gameController = (() => {
    const _humanPlayer = Player('X');
    const _aiPlayer = Player('O')
    // const _aiLogic = minimaxAiLogic;

    const getHumanPlayer = () => _humanPlayer;
    const getAiPlayer = () => _aiPlayer;

    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const switchFaction = (sign) => {
        if (sign === 'X') _humanPlayer.setSign('X', true), _aiPlayer.setSign('O');
        else if (sign === 'O') _humanPlayer.setSign('O', true), _aiPlayer.setSign('X');
        else throw 'Incorrect sign';
        displayController.disableTiles;
    }

    const _validateRows = (board) => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(board.getTiles(j));
            }
            if (row.every(tile => tile === 'X') || row.every(tile => tile === 'O')) return true;
        }
        return false;
    }

    const _validateColumns = (board) => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let j = 0; j < 3; j++) {
                column.push(board.getTiles(i + 3 * j));
            }
            if (column.every(tile => tile === 'X') || column.every(tile => tile === 'O')) return true;
        }
        return false;
    }

    const _validateDiagonals = (board) => {
        diagonal1 = [board.getTiles(0), board.getTiles(4), board.getTiles(8)];
        diagonal2 = [board.getTiles(2), board.getTiles(4), board.getTiles(6)];
        if (diagonal1.every(tile => tile === 'X') || diagonal1.every(tile => tile === 'O')) return true;
        else if (diagonal2.every(tile => tile === 'X') || diagonal2.every(tile => tile === 'O')) return true;
    }

    const validateDraw = (board) => {
        if (validateWin(board)) return false;
        for (let i = 0; i < 9; i++) {
            const tile = board.getTiles(i);
            if (tile === undefined) return false;
        }
        return true;
    }

    const validateWin = (board) => {
        if (_validateRows(board) || _validateColumns(board) || _validateDiagonals(board)) return true;
        return false;
    }

    const playerTurn = (num) => {
        const tile = gameBoard.getTiles(num);
        if (tile === undefined) {
            gameBoard.setTiles(num, _humanPlayer);
            if (validateWin(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    gameEnd(_humanPlayer.getSign());
                })();
            }
            else if (validateDraw(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    gameEnd("Draw");
                })();
            }
            else {
                displayController.disableTiles;
                (async () => {
                    await _sleep(250 + (Math.random() * 300));
                    aiTurn();
                    if (!validateWin(gameBoard)) displayController.enableTiles;
                })();
            }
        }
        else {
            console.log('Already Filled')
        }
    }

    const aiTurn = () => {
        const num = _aiLogic.chooseField();
        gameBoard.setTiles(num, _aiPlayer);
        if (validateWin(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd(_aiPlayer.getSign())
            })();

        }
        else if (validateDraw(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd("Draw");
            })();
        }
    }

    const gameEnd = function (sign) {

        /* const card = document.querySelector('.card');
        card.classList.remove('unblur');
        card.classList.add('blur');

        const winElements = document.querySelectorAll('.win p')

        if (sign == "Draw") {
            winElements[3].classList.remove('hide');
            console.log("Its a draw");
        }
        else {
            console.log(`The winner is player ${sign}`);
            winElements[0].classList.remove('hide');
            if(sign.toLowerCase() == 'x'){
                winElements[1].classList.remove('hide');
            }
            else{
                winElements[2].classList.remove('hide');
            }
        } */
        console.log('end');
        displayController.disableTiles;
    }

    const restart = async function () {

        const card = document.querySelector('.card');
        const winElements = document.querySelectorAll('.win p');

        card.classList.add('unblur');

        gameBoard.clearTiles();
        displayController.clearTiles();
        if (_humanPlayer.getSign() == 'O') {
            aiTurn();
        }
        console.log('restart');
        console.log(minimaxAiLogic.getAiPercentage());
        displayController.enableTiles;


        card.classList.remove('blur');

        winElements.forEach(element => {
            element.classList.add('hide');
        });
        document.body.removeEventListener('click', gameController.restart);

    }

    return {
        getHumanPlayer,
        getAiPlayer,
        switchFaction,
        validateWin,
        validateDraw,
        playerTurn,
        restart
    }
})();

const displayController = (() => {
    const gameTiles = [...(document.querySelectorAll('button.btn-game'))];
    const opponent = document.querySelector('select#opponent');
    const controls = document.querySelectorAll('button.btn-controls');
    const x = document.querySelector('#x');
    const o = document.querySelector('#o');

    const _changeOpponent = (event) => {
        const difficulty = event.target.value;
        switch (difficulty) {
            case 'easy': minimaxAiLogic.setAiPercentage(0); break;
            case 'medium': minimaxAiLogic.setAiPercentage(75); break;
            case 'impossible': minimaxAiLogic.setAiPercentage(100); break;
            case 'player': console.log('fix lol'); break;
        }
        gameController.restart();
    }

    const _changePlayerSign = (sign) => {
        gameController.switchFaction(sign);
        gameController.restart();
    }

    const clearTiles = () => {
        gameTiles.forEach(tile => tile.textContent = '');
    }

    const disableTiles = () => {
        gameTiles.forEach(tile => tile.setAttribute('disabled', ''));
    }

    const enableTiles = () => {
        gameTiles.forEach(tile => tile.removeAttribute('disabled'));
    }

    const _init = (() => {
        for (let i = 0; i < gameTiles.length; i++) {
            tile = gameTiles[i];
            tile.addEventListener('click', gameController.playerTurn.bind(tile, i));
        }

        if (opponent) opponent.addEventListener('change', _changeOpponent, false);
        controls.forEach(control => {
            if (control.value === 'reset') control.addEventListener('click', gameController.restart)
        });

        x.addEventListener('click', _changePlayerSign.bind(this, 'X'));
        o.addEventListener('click', _changePlayerSign.bind(this, 'O'));
    })();

    return {
        disableTiles,
        enableTiles,
        clearTiles,
    }
})();

gameController.switchFaction('X');

const setAttributes = (elem, attrs) => { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }