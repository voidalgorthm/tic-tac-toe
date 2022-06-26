function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Player = (faction, sentient) => {
    let _faction = faction;
    let _sentient = sentient;
    const getFaction = () => _faction;
    const getSentient = () => _sentient;
    const setFaction = (faction, sentient = false) => {
        _faction = faction;
        _sentient = sentient;
        const buttons = document.querySelectorAll('button.btn-faction');
        buttons.forEach(button => {
            if (button.value === faction) {
                if (sentient) button.classList.add('selected');
                else button.classList.remove('selected');
            }
        });
    }

    /* const reflectFaction = () => {
        
    } */

    return {
        getFaction,
        getSentient,
        setFaction,
        // reflectFaction,
    }
}

const gameBoard = (() => {
    let _board = [...Array(9)];
    const getBoard = () => _board;
    const getTiles = (num) => _board[num];
    const setTiles = (num, player) => {
        const gameTiles = document.querySelectorAll(`button.btn-game`);
        const gameTile = gameTiles.item(num);
        // gameTile.classList.add('marked');
        gameTile.textContent = player.getFaction();
        _board[num] = player.getFaction();
        gameTile.setAttribute('disabled', true);
    }

    const clearTiles = () => {
        _board = _board.map(tile => tile = undefined);
    }

    const getUnmarkedTiles = () => {
        let tiles = [];
        for (let i = 0; i < _board.length; i++) {
            if (_board[i] === undefined) tiles.push(i);
        }
        return tiles;
    }

    const setTilesAi = (num, player) => {
        if (player === undefined) {
            _board[num] = undefined;
            return;
        }
        _board[num] = player.getFaction();
    }

    return {
        getTiles,
        setTiles,
        clearTiles,
        getBoard,
        getUnmarkedTiles,
        setTilesAi
    };
})();

const minimaxAiPercent = ((percentage) => {

    let aiPrecision = percentage;

    const setAiPercentage = (percentage) => {
        aiPrecision = percentage;
    }
    const getAiPercentage = () => {
        return aiPrecision;
    }

    const chooseTile = () => {
        const value = Math.floor(Math.random() * (100 + 1));

        let choice = null;
        if (value <= aiPrecision) {
            console.log('Ai is choosing the best choice');
            choice = minimax(gameBoard, gameController.getAiPlayer()).index;
            const field = gameBoard.getTiles(choice);
            if (field !== undefined) return "error";
        }
        else {
            console.log('Ai may choose the best choice');
            const unmarkedTiles = gameBoard.getUnmarkedTiles();
            let averageMove = Math.floor(Math.random() * unmarkedTiles.length);
            choice = unmarkedTiles[averageMove];
        }
        return choice;
    }

    const findBestMove = (moves, player) => {
        let bestMove;
        if (player === gameController.getAiPlayer()) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    const minimax = (newBoard, player) => {

        let unmarked = newBoard.getUnmarkedTiles();

        if (gameController.validateDraw(newBoard)) {
            return {
                score: 0
            };
        }
        else if (gameController.validateWin(newBoard)) {
            if (player.getFaction() == gameController.getHumanPlayer().getFaction()) {
                return {
                    score: 10
                };
            }
            else if (player.getFaction() == gameController.getAiPlayer().getFaction()) {
                return {
                    score: -10
                };
            }
        }

        let moves = [];

        for (let i = 0; i < unmarked.length; i++) {
            let move = {};
            move.index = unmarked[i];

            newBoard.setTilesAi(unmarked[i], player);

            if (player.getFaction() === gameController.getAiPlayer().getFaction()) {
                let result = minimax(newBoard, gameController.getHumanPlayer());
                move.score = result.score;
            }
            else {
                let result = minimax(newBoard, gameController.getAiPlayer());
                move.score = result.score;
            }

            newBoard.setTilesAi(unmarked[i], undefined);
            moves.push(move);
        }

        return findBestMove(moves, player);
    }
    return {
        minimax,
        chooseTile,
        getAiPercentage,
        setAiPercentage
    }
})(0);

const gameController = (() => {
    const _humanPlayer = Player('X');
    const _aiPlayer = Player('O')
    const _aiLogic = minimaxAiPercent;

    const getHumanPlayer = () => _humanPlayer;
    const getAiPlayer = () => _aiPlayer;

    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const switchFaction = (faction) => {
        if (faction === 'X') _humanPlayer.setFaction('X', true), _aiPlayer.setFaction('O');
        else if (faction === 'O') _humanPlayer.setFaction('O', true), _aiPlayer.setFaction('X');
        else throw 'Incorrect faction';
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
                    gameEnd(_humanPlayer.getFaction());
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
        const num = _aiLogic.chooseTile();
        gameBoard.setTiles(num, _aiPlayer);
        if (validateWin(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd(_aiPlayer.getFaction())
            })();

        }
        else if (validateDraw(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd("Draw");
            })();
        }
    }

    const gameEnd = function (faction) {

        /* const card = document.querySelector('.card');
        card.classList.remove('unblur');
        card.classList.add('blur');

        const winElements = document.querySelectorAll('.win p')

        if (faction == "Draw") {
            winElements[3].classList.remove('hide');
            console.log("Its a draw");
        }
        else {
            console.log(`The winner is player ${faction}`);
            winElements[0].classList.remove('hide');
            if(faction.toLowerCase() == 'x'){
                winElements[1].classList.remove('hide');
            }
            else{
                winElements[2].classList.remove('hide');
            }
        } */
        console.log('end');
        // displayController.disableTiles;
    }

    const restart = async function () {

        // const card = document.querySelector('.card');
        // const winElements = document.querySelectorAll('.win p');

        // card.classList.add('unblur');

        gameBoard.clearTiles();
        displayController.clearTiles();
        if (_humanPlayer.getFaction() == 'O') {
            aiTurn();
        }
        displayController.enableTiles();
        console.log('reset');
        console.log(minimaxAiPercent.getAiPercentage());


        // card.classList.remove('blur');
        /* 
                winElements.forEach(element => {
                    element.classList.add('hide');
                });
                document.body.removeEventListener('click', gameController.restart); */

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
    const reset = document.querySelector('button#reset');
    const x = document.querySelector('#x');
    const o = document.querySelector('#o');

    const _changePlayerFaction = (faction) => {
        gameController.switchFaction(faction);
        gameController.restart();
    }

    const _changeOpponent = (event) => {
        const difficulty = event.target.value;
        switch (difficulty) {
            case 'easy': minimaxAiPercent.setAiPercentage(0); break;
            case 'medium': minimaxAiPercent.setAiPercentage(75); break;
            case 'impossible': minimaxAiPercent.setAiPercentage(100); break;
            case 'player': console.log('fix lol'); break;
        }
        gameController.restart();
    }

    const clearTiles = () => {
        gameTiles.forEach(tile => tile.textContent = '');
    }

    const disableTiles = () => {
        gameTiles.forEach(tile => tile.setAttribute('disabled'));
    }

    const enableTiles = () => {
        gameTiles.forEach(tile => tile.removeAttribute('disabled'));
    }

    const _bindKeyInputs = () => {
        for (let i = 0; i < gameTiles.length; i++) {
            let tile = gameTiles[i];
            tile.addEventListener('click', gameController.playerTurn.bind(this, i));
        }
    }

    const _init = (() => {
        _bindKeyInputs();

        opponent.addEventListener('change', _changeOpponent, false);
        reset.addEventListener('click', gameController.restart)

        x.addEventListener('click', _changePlayerFaction.bind(this, 'X'));
        o.addEventListener('click', _changePlayerFaction.bind(this, 'O'));
    })();

    return {
        disableTiles,
        enableTiles,
        clearTiles,
    }
})();

const setAttributes = (elem, attrs) => { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }