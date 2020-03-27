const playerForm = document.getElementById("form")

const playerFactory = (name, selector, turn, score) => {
    return { name, selector, turn, score }
}


const newGame = playerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let playerOneName = document.getElementById("player1name-input").value;
    let playerTwoName = document.getElementById("player2name-input").value;
    let gameMode = document.getElementById("game-type").value;

    document.getElementById("player1-name").textContent = playerOneName;
    document.getElementById("player2-name").textContent = playerTwoName;

    document.getElementById("form-container").style.display = "none"

})

let playerOne = playerFactory(document.getElementById("player1-name").textContent, "X", true, 0)
let playerTwo = playerFactory(document.getElementById("player2-name").textContent, "O", false, 0)






const gameboard = (() => {


    const checkVictory = (player) => {
        Object.values(rows).forEach(array => {
            if (array.length == 3 && new Set(array).size == 1) {
                document.getElementById("gameboard-container").style.pointerEvents = "none"
                player.score++
                if (player.selector == "X") {
                    document.getElementById("player1-score").textContent = player.score;
                } else {
                    document.getElementById("player2-score").textContent = player.score;
                }
                setTimeout(emptyBoard, 2000)
                setTimeout(() => { document.getElementById("gameboard-container").style.pointerEvents = "auto" }, 2000)
            }
        })
    }

    const rows = {
        rowOne: [],
        rowTwo: [],
        rowThree: [],
        colOne: [],
        colTwo: [],
        colThree: [],
        diagOne: [],
        diagTwo: []
    }


    const populateTable = (selector, row, col, diag) => {

        const populateRows = (selector, row) => {
            switch (row) {
                case "1":
                    rows.rowOne.push(selector)
                    break;
                case "2":
                    rows.rowTwo.push(selector);
                    break;
                case "3":
                    rows.rowThree.push(selector);
                    break;
            }
        }

        const populateColumns = (selector, col) => {
            switch (col) {
                case "1":
                    rows.colOne.push(selector);
                    break;
                case "2":
                    rows.colTwo.push(selector);
                    break;
                case "3":
                    rows.colThree.push(selector);
                    break;
            }
        }

        const populateDiagonals = (selector, diag) => {
            switch (diag) {
                case "1":
                    rows.diagOne.push(selector);
                    break;
                case "2":
                    rows.diagTwo.push(selector);
                    break;
                case "3":
                    rows.diagOne.push(selector);
                    rows.diagTwo.push(selector);
                    break;
            }
        }

        populateRows(selector, row);
        populateColumns(selector, col);
        populateDiagonals(selector, diag);
    }


    const emptyBoard = () => {
        const boxes = document.getElementsByClassName("box");
        for (box of boxes) {
            box.textContent = ""
        }
        Object.values(rows).forEach(arr => {
            arr.length = 0
        })
    }

    document.getElementById("reset").addEventListener("click", emptyBoard)

    const fillBox = (() => {
        const boxes = document.getElementsByClassName("box");
        for (box of boxes) {
            box.addEventListener("click", (e) => {
                if (!e.target.textContent) {
                    let player = swapPlayers()
                    e.target.textContent = player.selector
                    populateTable(e.target.textContent, ...Object.values(e.target.dataset))
                    checkVictory(player);
                }
            })
        }
    })()

    const swapPlayers = () => {
        if (playerOne.turn === true) {
            playerTwo.turn = true;
            playerOne.turn = false;
            return playerOne
        } else {
            playerOne.turn = true;
            playerTwo.turn = false;
            return playerTwo
        }
    }

    return { fillBox, emptyBoard }

})()

for (item of document.getElementsByClassName("box")) {
    item.addEventListener("click", gameboard.fillBox)
}


document.getElementById("new-game").addEventListener("click", () => {
    document.getElementById("form-container").style.display = "block";
    playerOne.score = 0;
    playerTwo.score = 0;
    document.getElementById("player1-score").textContent = playerOne.score;
    document.getElementById("player2-score").textContent = playerTwo.score;
    gameboard.emptyBoard
})

/*
legare player.score a html [X]
azzerare rows quando emptyRows [X]
azzerare rows e punteggio quando newGame [X]
bloccare partita quando si vince [X]
bloccare partita quando si pareggia
aggiungere pareggio sotto i due playerscore
aggiungere AI
modificare form quando si seleziona single player/multiplayer
modificare grafica sito
*/