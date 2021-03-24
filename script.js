const Player = (marker) => {
    let turn = false;

    const play = () => {
        return marker;
    };

    return {turn, play}
};

const gameBoard = (() => {
    let boardValues = [];

    const render = (board) => {
        for (let i = 0; i < 9; i++) {
            const boardElement = document.createElement('div');
            boardElement.className = 'board-element';
            boardElement.setAttribute('data-index', i);
            boardElement.addEventListener('click', game.play);
            board.appendChild(boardElement);

            boardValues.push(null);
        }
    }

    const update = () => {
        const boardBoxes = document.querySelectorAll('.board-element');
        boardBoxes.forEach((box, index) => {
            box.textContent = boardValues[index] ? boardValues[index] : '';
        });
    }
    
    return {boardValues, render, update}
})();

const game = (() => {
    let _markers = ["X", "O"];

    const player1 = Player(_markers.shift());
    const player2 = Player(_markers.shift());

    const gameover = () => {
        // check if board has 3 symbols aligned
    };
    
    const play = (event) => {
        const boxIndex = event.target.dataset.index;
        let marker;
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
        gameBoard.boardValues.splice(boxIndex, 1, marker);
        gameBoard.update();
    };

    return {player1, player2, play}
})();

const board = document.querySelector('#board-container');
gameBoard.render(board);
game.player1.turn = true;