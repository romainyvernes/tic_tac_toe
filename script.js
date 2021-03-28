const Player = (playerName, playerMarker) => {
    let turn = false;
    let name = playerName;
    let marker = playerMarker;
    
    return {turn, marker, name}
};

const homeDisplay = (() => {

    const overlay = document.querySelector('#overlay');

    const render = () => {
        const players = document.querySelectorAll('input[type="text"]');
        players.forEach(player => player.addEventListener('click', togglePlayer));

        const playerSelection = document.querySelector('#player-selection');
        playerSelection.addEventListener('submit', game.start);
    };

    const togglePlayer = (event) => {
        const selectedPlayer = event.target;
        const otherPlayer = selectedPlayer.previousElementSibling ||
                selectedPlayer.nextElementSibling;

        const transform = 'none';
        const background = 'grey';
        const color = 'white';

        const newTransform = 'scale(1.2)';
        const newBackground = 'lightgrey';
        const newColor = 'black';

        selectedPlayer.dataset.checked = 'true';
        selectedPlayer.style.transform = newTransform;
        selectedPlayer.style.backgroundColor = newBackground;
        selectedPlayer.style.color = newColor;

        otherPlayer.dataset.checked = 'false';
        otherPlayer.style.transform = transform;
        otherPlayer.style.backgroundColor = background;
        otherPlayer.style.color = color;

        if (otherPlayer.value === '') {
            otherPlayer.value = `Player ${otherPlayer.dataset.index}`;
        }
    };

    const show = () => {
        overlay.style.display = 'block';
    };

    const hide = () => {
        overlay.style.display = 'none';
    };

    return {render, show, hide}
})();

const playerDisplay = (() => {
    const toggle = () => {
        const players = document.querySelectorAll('.player');
        
        const boxShadow = 'none';
        const transform = 'none';
        const color = 'grey';
        const background = 'white';
        
        const newBoxShadow = '2px 2px 1px 1px rgba(0, 0, 0, 0.5)';
        const newTransform = 'scale(1.1)';
        const newColor = 'black';
        const newBackground = 'rgb(255, 204, 127)';

        if (game.player1.turn) {
            players[0].style.boxShadow = newBoxShadow;
            players[0].style.transform = newTransform;
            players[0].style.color = newColor;
            players[0].style.backgroundColor = newBackground;

            players[1].style.boxShadow = boxShadow;
            players[1].style.transform = transform;
            players[1].style.color = color;
            players[1].style.backgroundColor = background;
        } else {
            players[1].style.boxShadow = newBoxShadow;
            players[1].style.transform = newTransform;
            players[1].style.color = newColor;
            players[1].style.backgroundColor = newBackground;

            players[0].style.boxShadow = boxShadow;
            players[0].style.transform = transform;
            players[0].style.color = color;
            players[0].style.backgroundColor = background;
        }
    };

    const update = () => {
        const playerNames = document.querySelectorAll('.player-name');
        const markers = document.querySelectorAll('.marker');

        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                playerNames[i].textContent = game.player1.name;
                markers[i].textContent = game.player1.marker;
            } else {
                playerNames[i].textContent = game.player2.name;
                markers[i].textContent = game.player2.marker;
            }
        }

        game.player1
    };

    return {toggle, update}
})();

const gameBoard = (() => {
    let values = [];

    const render = () => {
        for (let i = 0; i < 9; i++) {
            const board = document.querySelector('#board-container');
            const boardElement = document.createElement('div');
            
            boardElement.className = 'board-element';
            boardElement.setAttribute('data-index', i);
            boardElement.addEventListener('click', game.play);
            board.appendChild(boardElement);

            gameBoard.values.push(null);
        }
    }

    const update = () => {
        const boardBoxes = document.querySelectorAll('.board-element');
        boardBoxes.forEach((box, index) => {
            const newColor = 'rgba(0,0,0,1)';
            const newSize = '4em';
            
            if (gameBoard.values[index]) {
                box.textContent = gameBoard.values[index];
                box.style.color = newColor;
                box.style.fontSize = newSize;
            } else {
                box.textContent = '';
            }
        });
    }

    const displayLine = (box, orientation) => {
        const horizontalLine = document.querySelector('#horizontal');
        const verticalLine = document.querySelector('#vertical');
        const diagonalLine = document.querySelector('#diagonal');

        switch (box) {
            case 0:
                horizontalLine.style.transform = 'translateY(-29%)';
                verticalLine.style.transform = 'translateX(-29%)';
                break;
            case 2:
                verticalLine.style.transform = 'translateX(29%)';
                diagonalLine.style.transform = 'scaleX(-1)';
                break;
            case 6:
                horizontalLine.style.transform = 'translateY(29%)';
                break;
        }
        
        switch (orientation) {
            case 'horizontal':
                horizontalLine.style.display = 'block';
                setTimeout(() => {
                    horizontalLine.style.opacity = '1';
                }, 300);
                break;
            case 'vertical':
                verticalLine.style.display = 'block';
                setTimeout(() => {
                    verticalLine.style.opacity = '1';
                }, 300);
                break;
            case 'diagonal':
                diagonalLine.style.display = 'block';
                setTimeout(() => {
                    diagonalLine.style.opacity = '1';
                }, 300);
                break;
        }
    };

    const hideLine = () => {
        const lines = document.querySelectorAll('#game-board img');
        lines.forEach(line => line.style.display = 'none');
    };
    
    return {values, render, update, displayLine, hideLine}
})();

const game = (() => {
    let run = false;

    let player1;
    let player2;

    const start = (event) => {
        // prevent page refresh
        event.preventDefault();

        const player1Name = event.target[0].value || 'Player 1';
        const player2Name = event.target[1].value || 'Player 2';

        let selectedMarker;
        let otherMarker;

        if (event.target[2].checked) {
            selectedMarker = event.target[2].nextElementSibling.textContent;
            otherMarker = event.target[3].nextElementSibling.textContent;
        } else {
            selectedMarker = event.target[3].nextElementSibling.textContent;
            otherMarker = event.target[2].nextElementSibling.textContent;
        }

        // determine which of the 2 player inputs was selected, and create 
        // player objects
        if (event.target[0].dataset.checked === 'true') {
            game.player1 = Player(player1Name, selectedMarker);
            game.player2 = Player(player2Name, otherMarker);
        } else {
            game.player1 = Player(player1Name, otherMarker);
            game.player2 = Player(player2Name, selectedMarker);
        }

        playerDisplay.update();
        homeDisplay.hide();
        game.player1.turn = true;
        
        // clear board if filled
        restart();
    }

    const restart = () => {
        gameBoard.values = [];
        
        const boardElements = document.querySelectorAll('.board-element');
        boardElements.forEach(element => element.remove());

        gameBoard.hideLine();
        gameBoard.render();
        controlsDisplay.hideRestart();
        game.run = true;
        playerDisplay.toggle();
    };

    const end = () => {
        game.run = false;
        controlsDisplay.showRestart();
    };

    const checkTie = () => {
        for (let i = 0; i < gameBoard.values.length; i++) {
            if (!gameBoard.values[i]) {
                return false;
            }
        }

        return true;
    }

    const checkWinner = () => {
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        let result = {
            status: false,
            name: null,
            box: null,
            orientation: null
        };
        
        for (let i = 0; i < winningCombinations.length; i++) {
            let winner = [];
            
            for (let j = 0; j < 3; j++) {
                if (gameBoard.values[winningCombinations[i][j]]) {
                    if (winner.length === 0) {
                        winner.push(gameBoard.values[winningCombinations[i][j]]);
                    } else {
                        if (winner[0] === gameBoard.values[winningCombinations[i][j]]) {
                            winner.push(gameBoard.values[winningCombinations[i][j]]);
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }

            if (winner.length === 3) {
                result.status = true;
                result.name = winner[0];
                result.box = winningCombinations[i][0];
                
                if (i >= 0 && i <= 2) {
                    result.orientation = 'horizontal';
                } else if (i >= 3 && i <= 5) {
                    result.orientation = 'vertical';
                } else {
                    result.orientation = 'diagonal';
                }

                return result;
            }
        }

        return result;
    };
    
    const play = (event) => {
        const box = event.target;
        const boxIndex = box.dataset.index;
        let marker;

        if (!game.run) {
            return;
        }
        
        if (box.textContent !== '') {
            return;
        }

        if (game.player1.turn) {
            marker = game.player1.marker;
            game.player1.turn = false;
            game.player2.turn = true;
        }
        else {
            marker = game.player2.marker;
            game.player2.turn = false;
            game.player1.turn = true;
        }

        gameBoard.values.splice(boxIndex, 1, marker);
        gameBoard.update();

        const winnerCheck = checkWinner();

        if (winnerCheck.status) {
            end();
            gameBoard.displayLine(winnerCheck.box, winnerCheck.orientation);
        } else if (checkTie()) {
            end();
        } else {
            playerDisplay.toggle();
        }
    };

    return {player1, player2, start, play, restart}
})();

const controlsDisplay = (() => {
    const restartBtn = document.querySelector('#restart');
    
    const render = () => {
        const resetBtn = document.querySelector('#reset');
        resetBtn.addEventListener('click', homeDisplay.show);

        restartBtn.addEventListener('click', game.restart);
    };
    
    const showRestart = () => {
        restartBtn.style.display = 'block';
    };

    const hideRestart = () => {
        restartBtn.style.display = 'none';
    };

    return {showRestart, hideRestart, render}
})();

homeDisplay.render();
gameBoard.render();
controlsDisplay.render();