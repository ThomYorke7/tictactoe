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





const emptyBoard = () => {
    const boxes = document.getElementsByClassName("box");
    for (box of boxes) {
        box.textContent = ""
    }
}

document.getElementById("new-game").addEventListener("click", () => {
    document.getElementById("form-container").style.display = "block";
    emptyBoard();
})


/* QUESTO VA SPOSTATO ALTROVE POICHE DEVE SVUOTARE ANCHE I VALORI DI ROWS */
document.getElementById("reset").addEventListener("click", emptyBoard)




const gameboard = (() => {


    const checkVictory = (player) => {
        Object.values(rows).forEach(array => {
            if (array.length == 3 && new Set(array).size == 1) {
                console.log("You won")
                player.score++
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

    return { fillBox }

})()

for (item of document.getElementsByClassName("box")) {
    item.addEventListener("click", gameboard.fillBox)
}


/*
legare player.score a html
azzerare rows quando emptyRows o newGame
bloccare partita quando si vince/pareggia
oppure mettere setInterval e azzerare la griglia dopo tot secondi
aggiungere pareggio sotto i due playerscore
*/