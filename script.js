const Player = (marker) => {
    let turn = false;

    const play = () => {
        return marker;
    };

    return {turn, play}
};

const homeDisplay = (() => {

    const render = () => {
        const players = document.querySelectorAll('input[type="text"]');
        players.forEach(player => player.addEventListener('click', togglePlayer));
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

        selectedPlayer.style.transform = newTransform;
        selectedPlayer.style.backgroundColor = newBackground;
        selectedPlayer.style.color = newColor;

        otherPlayer.style.transform = transform;
        otherPlayer.style.backgroundColor = background;
        otherPlayer.style.color = color;

        if (otherPlayer.value === '') {
            otherPlayer.value = `Player ${otherPlayer.dataset.index}`;
        }
    };

    return {render}
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

    return {toggle}
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

            values.push(null);
        }
    }

    const update = () => {
        const boardBoxes = document.querySelectorAll('.board-element');
        boardBoxes.forEach((box, index) => {
            const newColor = 'rgba(0,0,0,1)';
            const newSize = '4em';
            
            if (values[index]) {
                box.textContent = values[index];
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
    
    return {values, render, update, displayLine}
})();

const game = (() => {
    let _markers = ["X", "O"];

    const player1 = Player(_markers.shift());
    const player2 = Player(_markers.shift());

    let start = false;

    const end = () => {
        game.start = false;
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

        if (!game.start) {
            return;
        }
        
        if (box.textContent !== '') {
            return;
        }

        if (player1.turn) {
            marker = player1.play();
            player1.turn = false;
            player2.turn = true;
        }
        else {
            marker = player2.play();
            player2.turn = false;
            player1.turn = true;
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

    return {player1, player2, start, play}
})();

homeDisplay.render();
gameBoard.render();
game.start = true;
game.player1.turn = true;
playerDisplay.toggle();