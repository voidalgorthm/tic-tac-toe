const Player = (faction, sentient = false) => {
    let _faction = faction;
    let _sentient = sentient;
    const getFaction = () => _faction;
    const getSentient = () => _sentient;
    const setFaction = (faction, sentient = false) => {
        _faction = faction;
        _sentient = sentient;
    }

    return {
        getFaction,
        getSentient,
        setFaction,
    }
}

const gameBoard = (() => {
    let _board = [...Array(9)];
    const getBoard = () => _board;
    const getTile = (num) => _board[num];
    const setTile = (num, player) => {
        const gameTiles = document.querySelectorAll(`button.btn-game`);
        const gameTile = gameTiles.item(num);
        // gameTile.classList.add('marked');
        gameTile.textContent = player.getFaction();
        _board[num] = player.getFaction();
    }

    const clearBoard = () => {
        _board = _board.map(tile => tile = undefined);
    }

    const getUnmarkedTilesAi = () => {
        let unmarked = [];
        for (let i = 0; i < _board.length; i++) {
            if (_board[i] === undefined) unmarked.push(i);
        }
        return unmarked;
    }

    const setTilesAi = (num, player) => {
        if (player === undefined) {
            _board[num] = undefined;
            return;
        }
        _board[num] = player.getFaction();
    }

    return {
        getBoard,
        getTile,
        setTile,
        clearBoard,
        getUnmarkedTilesAi,
        setTilesAi
    };
})();

const minimaxAiPercent = ((percentage) => {
    let aiPrecision = percentage;
    let _aiPlayer, _humanPlayer;

    const setAiPlayer = (player) => {
        _aiPlayer = player;
    }

    const setHumanPlayer = (player) => {
        _humanPlayer = player;
    }

    const setAiPercentage = (percentage) => {
        aiPrecision = percentage;
    }

    const getAiPercentage = () => {
        return aiPrecision;
    }

    const chooseAiTile = () => {
        const value = Math.floor(Math.random() * (100 + 1));

        let choice = null;
        if (value <= aiPrecision) {
            console.log('Best choice');
            choice = minimax(gameBoard, _aiPlayer).index;
            const tile = gameBoard.getTile(choice);
            if (tile !== undefined) return "error";
        } else {
            console.log('Random choice');
            const unmarkedTiles = gameBoard.getUnmarkedTilesAi();
            let averageMove = Math.floor(Math.random() * unmarkedTiles.length);
            choice = unmarkedTiles[averageMove];
        }
        return choice;
    }

    const findAiBestMove = (moves, player) => {
        let bestMove;
        if (player === _aiPlayer) {
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

    const minimax = (hypoBoard, player) => {

        let unmarked = hypoBoard.getUnmarkedTilesAi();

        if (gameController.validateDraw(hypoBoard)) {
            return {
                score: 0
            };
        } else if (gameController.validateWin(hypoBoard)) {
            if (player.getFaction() == _humanPlayer.getFaction()) {
                return {
                    score: 10
                };
            } else if (player.getFaction() == _aiPlayer.getFaction()) {
                return {
                    score: -10
                };
            }
        }

        let moves = [];

        for (let i = 0; i < unmarked.length; i++) {
            let move = {};
            move.index = unmarked[i];

            hypoBoard.setTilesAi(unmarked[i], player);

            if (player.getFaction() === _aiPlayer.getFaction()) {
                let result = minimax(hypoBoard, _humanPlayer);
                move.score = result.score;
            } else {
                let result = minimax(hypoBoard, _aiPlayer);
                move.score = result.score;
            }

            hypoBoard.setTilesAi(unmarked[i], undefined);
            moves.push(move);
        }

        return findAiBestMove(moves, player);
    }
    return {
        setAiPlayer,
        setHumanPlayer,
        chooseAiTile,
        getAiPercentage,
        setAiPercentage,
        minimax,
    }
})(0);

const gameController = (() => {
    const _aiLogic = minimaxAiPercent;
    let _player1 = Player('X', true), _player2 = Player('O');
<<<<<<< HEAD
    let _lastHumanFaction;


=======
>>>>>>> origin/main

    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;
    let counter = 0;

    const _sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }

    const vsPlayer = () => {
        _lastHumanFaction = determineHumanPlayer().getFaction();
        _player1 = Player('X', true);
        _player2 = Player('O', true);
    }

<<<<<<< HEAD
    const vsAi = (faction) => {
        if (faction === 'X') _player1.setFaction('X', true), _player2.setFaction('O');
        else if (faction === 'O') _player2.setFaction('O', true), _player1.setFaction('X');
        else throw 'Incorrect faction';
    }

    const getLastHuman = () => {
        return _lastHumanFaction;
    }

    const _sendPlayers = () => {
        const humanPlayer = determineHumanPlayer();
        _aiLogic.setHumanPlayer(humanPlayer);
        const aiPlayer = _determineAiPlayer();
        _aiLogic.setAiPlayer(aiPlayer);
    }

    const determineHumanPlayer = () => {
=======
    const _sendPlayers = () => {
        const humanPlayer = _determineHumanPlayer();
        _aiLogic.setHumanPlayer(humanPlayer);
        const aiPlayer = _determineAiPlayer();
        _aiLogic.setAiPlayer(aiPlayer);
    }

    const _determineHumanPlayer = () => {
>>>>>>> origin/main
        let _humanPlayer;
        if (getPlayer1().getSentient()) _humanPlayer = getPlayer1();
        else if (getPlayer2().getSentient()) _humanPlayer = getPlayer2();
        return _humanPlayer;
    }

    const _determineAiPlayer = () => {
        let _aiPlayer;
        if (getPlayer1().getSentient()) _aiPlayer = getPlayer2();
        else if (getPlayer2().getSentient()) _aiPlayer = getPlayer1();
        return _aiPlayer;
    }

    const determineVsHuman = () => {
        if (getPlayer1().getSentient() && getPlayer2().getSentient()) return true;
        return false;
    }

    const switchFaction = (faction) => {
        if (determineVsHuman()) _player1.setFaction('X', true), _player2.setFaction('O', true);
        else {
<<<<<<< HEAD
            vsAi(faction);
=======
            if (faction === 'X') _player1.setFaction('X', true), _player2.setFaction('O');
            else if (faction === 'O') _player2.setFaction('O', true), _player1.setFaction('X');
            else throw 'Incorrect faction';
>>>>>>> origin/main
        }
    }

    const playerTurn = (num) => {
        const tile = gameBoard.getTile(num);
        if (tile !== undefined) console.log('Tile already filled');
        let count = counter % 2;

        let player;
        if (determineVsHuman()) {
<<<<<<< HEAD
            if (count === 0) player = _player1;
            else if (count === 1) player = _player2;
        } else {
            if (_player1.getSentient()) player = _player1;
            else if (_player2.getSentient()) player = _player2;
=======
            if (count === 0) nextPlayer = _player2, newPlayer = _player1;
            else if (count === 1) nextPlayer = _player1, newPlayer = _player2;
        } else {
            if (_player1.getSentient()) newPlayer = _player1;
            else if (_player2.getSentient()) newPlayer = _player2;
>>>>>>> origin/main
        }

        if (tile === undefined) {
            gameBoard.setTile(num, player);

            if (validateWin(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    gameEnd(player.getFaction());
                })();
            }

            else if (validateDraw(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    gameEnd('draw');
                })();
            }

            else {
                displayController.disableTiles;
                (async () => {
                    await _sleep(250 + (Math.random() * 300));
                    displayController.enableTiles;
                    if (determineVsHuman()) {
                        ++counter;
                        displayController.bindKeyInputs();
                    }
                    else {
                        _sendPlayers();
                        aiTurn();
                    }

                })();
            }
        }
    }

    const aiTurn = () => {
        const num = _aiLogic.chooseAiTile();
        let player;

        if (!(determineVsHuman())) player = _player1.getSentient() ? _player2 : _player1;

        gameBoard.setTile(num, player);

        if (validateWin(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd(player.getFaction())
            })();
        }

        else if (validateDraw(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                gameEnd('draw');
            })();
        }
    }

    const _validateRows = (board) => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(board.getTile(j));
            }
            if (row.every(tile => tile === 'X') || row.every(tile => tile === 'O')) return true;
        }
        return false;
    }

    const _validateColumns = (board) => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let j = 0; j < 3; j++) {
                column.push(board.getTile(i + 3 * j));
            }
            if (column.every(tile => tile === 'X') || column.every(tile => tile === 'O')) return true;
        }
        return false;
    }

    const _validateDiagonals = (board) => {
        diagonal1 = [board.getTile(0), board.getTile(4), board.getTile(8)];
        diagonal2 = [board.getTile(2), board.getTile(4), board.getTile(6)];
        if (diagonal1.every(tile => tile === 'X') || diagonal1.every(tile => tile === 'O')) return true;
        else if (diagonal2.every(tile => tile === 'X') || diagonal2.every(tile => tile === 'O')) return true;
        return false;
    }

    const validateDraw = (board) => {
        if (validateWin(board)) return false;
        for (let i = 0; i < 9; i++) {
            const tile = board.getTile(i);
            if (tile === undefined) return false;
        }
        return true;
    }

    const validateWin = (board) => {
        if (_validateRows(board) || _validateColumns(board) || _validateDiagonals(board)) return true;
        return false;
    }

    const gameEnd = function (faction) {

        const board = document.querySelector('.board');
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const output = document.createElement('div');
        const results = document.createElement('div');
        output.className = 'output';
        results.className = 'results';


        output.textContent = (faction === 'draw') ? 'XO' : (faction === 'X') ? 'X' : (faction === 'O') ? 'O' : 'Incorrect faction';
        results.textContent = (faction === 'draw') ? 'DRAW!' : (faction === 'X' || faction === 'O') ? 'WINNER!' : 'Unknown status';

        overlay.appendChild(output);
        overlay.appendChild(results);
        board.appendChild(overlay);

        displayController.disableTiles;
        overlay.addEventListener('click', () => {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                board.removeChild(overlay);
                reset();
            })();

        })
        console.log('Game End');
    }

    const reset = async function () {

        gameBoard.clearBoard();
        displayController.clearTiles();
        displayController.enableTiles();
<<<<<<< HEAD
        if (determineHumanPlayer().getFaction() === 'O') {
            aiTurn();
        }
        console.log('Game Reset');
=======
        if (_determineHumanPlayer().getFaction() === 'O') {
            aiTurn();
        }
        console.log('reset');

        // card.classList.remove('blur');
        /* 
                winElements.forEach(element => {
                    element.classList.add('hide');
                });
                document.body.removeEventListener('click', gameController.reset); */

>>>>>>> origin/main
    }

    return {
        getPlayer1,
        getPlayer2,
<<<<<<< HEAD
        vsPlayer,
        vsAi,
        getLastHuman,
        determineHumanPlayer,
=======
>>>>>>> origin/main
        determineVsHuman,
        switchFaction,
        playerTurn,
        validateDraw,
        validateWin,
        reset,
    }
})();

const displayController = (() => {
    const gameTiles = [...(document.querySelectorAll('button.btn-game'))];
    const opponent = document.querySelector('select#opponent');
    // let difficulty;
    const reset = document.querySelector('button#reset');
    const x = document.querySelector('#x');
    const o = document.querySelector('#o');

    const getSelectValue = () => opponent.value;

    const bindKeyInputs = () => {
        for (let i = 0; i < gameTiles.length; i++) {
            let tile = gameTiles[i];
            tile.addEventListener('click', gameController.playerTurn.bind(this, i));
        }
    }

    const _changePlayerFaction = (faction) => {
        gameController.switchFaction(faction);
        _changeButtonSelected(faction);
        gameController.reset();
    }

    const _changeButtonSelected = (faction) => {
        const buttons = document.querySelectorAll('button.btn-faction');
        buttons.forEach(button => {
            if (button.value === faction) button.classList.add('selected');
            else button.classList.remove('selected');
        });
    }

    const _changeOpponent = (event) => {
        difficulty = event.target.value;
        switch (difficulty) {
            case 'easy': minimaxAiPercent.setAiPercentage(0); break;
            case 'medium': minimaxAiPercent.setAiPercentage(75); break;
            case 'hard': minimaxAiPercent.setAiPercentage(90); break;
            case 'impossible': minimaxAiPercent.setAiPercentage(100); break;
            case 'player': gameController.vsPlayer(); break;
        }
        console.log(`AI at ${minimaxAiPercent.getAiPercentage()}\% competence`);
<<<<<<< HEAD
        const buttons = document.querySelectorAll('button.btn-faction');

        if (difficulty === 'player') buttons.forEach(button => button.classList.remove('selected'));
        else {
            const lastFaction = gameController.getLastHuman();
            _changeButtonSelected(lastFaction);
            gameController.vsAi(lastFaction);
        }
=======
>>>>>>> origin/main
        gameController.reset();
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

    const _init = (() => {
        console.log(`AI at ${minimaxAiPercent.getAiPercentage()}\% competence`);
        bindKeyInputs();
        opponent.addEventListener('change', _changeOpponent, false);
        x.addEventListener('click', _changePlayerFaction.bind(this, 'X'));
        o.addEventListener('click', _changePlayerFaction.bind(this, 'O'));
        reset.addEventListener('click', gameController.reset)

    })();

    return {
        getSelectValue,
        bindKeyInputs,
        clearTiles,
        disableTiles,
        enableTiles,
    }
})();

const setAttributes = (elem, attrs) => { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }