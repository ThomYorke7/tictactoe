const playerForm = document.getElementById("form")

const playerFactory = (name, selector, turn, score) => {
    return { name, selector, turn, score }
}


const newGame = playerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let playerOneName = document.getElementById("player1name-input").value;
    let playerTwoName = document.getElementById("player2name-input").value;
    let gameMode = document.querySelector('input[type="radio"]:checked')

    document.getElementById("player1-name").textContent = playerOneName;
    document.getElementById("player2-name").textContent = playerTwoName;

    document.getElementById("form-container").style.display = "none"

    if (gameMode.value == "multiplayer") {
        for (item of document.getElementsByClassName("box")) {
            item.addEventListener("click", gameboard.fillBoxSingle())
        }
    }

})

let playerOne = playerFactory(document.getElementById("player1-name").textContent, "X", true, 0)
let playerTwo = playerFactory(document.getElementById("player2-name").textContent, "O", false, 0)




document.getElementById("new-game").addEventListener("click", () => {
    document.getElementById("form-container").style.display = "block";
    playerOne.score = 0;
    playerTwo.score = 0;
    document.getElementById("player1-score").textContent = playerOne.score;
    document.getElementById("player2-score").textContent = playerTwo.score;
    gameboard.emptyBoard()
})






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
            } else {
                checkTie()
            }
        })
    }


    const checkTie = () => {
        if (Object.values(rows).every(i => i.length == 3)) {
            setTimeout(emptyBoard, 2000)
        }
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


    const computerTurn = (() => {

        const randomMove = () => {
            const boxes = document.getElementsByClassName("box");
            let index = Math.floor((Math.random() * 9));
            if (!boxes[index].textContent) {
                boxes[index].textContent = "O";
                populateTable("O", ...Object.values(boxes[index].dataset))
            } else {
                index = Math.floor((Math.random() * 9));
                boxes[index].textContent = "O";
                populateTable("O", ...Object.values(boxes[index].dataset))
            }
        }

        const smartMove = (position) => {
            let lines = document.querySelectorAll(position)
            Object.values(lines).some(box => {
                if (!box.textContent) {
                    box.textContent = "O"
                    populateTable("O", ...Object.values(box.dataset))
                    return true
                }
            })
        }

        const checkRows = () => {
            const checkMatchpoint = () => {
                let chance = [0]
                Object.entries(rows).some(([key, array]) => {
                    if (array.length == 2 && new Set(array).size == 1) {
                        switch (key) {
                            case "rowOne":
                                smartMove("[data-row='1']")
                                break;
                            case "rowTwo":
                                smartMove("[data-row='2']")
                                break;
                            case "rowThree":
                                smartMove("[data-row='3']")
                                break;
                            case "colOne":
                                smartMove("[data-col='1']")
                                break;
                            case "colTwo":
                                smartMove("[data-col='2']")
                                break;
                            case "colThree":
                                smartMove("[data-col='3']")
                                break;
                            case "diagOne":
                                smartMove("[data-diag='1']")
                                smartMove("[data-diag='3']")
                                break;
                            case "diagTwo":
                                smartMove("[data-diag='2']")
                                smartMove("[data-diag='3']")
                                break;
                        }
                        chance.push(1)
                        return true
                    } else { chance.push(0) }
                })
                return chance[chance.length - 1]
            }


            const move = checkMatchpoint()
            if (move == 0) {
                Object.entries(rows).some(([key, array]) => {
                    if (array.length >= 1 && array.includes("O")) {
                        switch (key) {
                            case "rowOne":
                                smartMove("[data-row='1']")
                                return true;
                            case "rowTwo":
                                smartMove("[data-row='2']")
                                return true;
                            case "rowThree":
                                smartMove("[data-row='3']")
                                return true;
                            case "colOne":
                                smartMove("[data-col='1']")
                                return true;
                            case "colTwo":
                                smartMove("[data-col='2']")
                                return true;
                            case "colThree":
                                smartMove("[data-col='3']")
                                return true;
                            case "diagOne":
                                smartMove("[data-diag='1']")
                                return true;
                            case "diagTwo":
                                smartMove("[data-row='2']")
                                return true;
                            default:
                                return true
                        }
                    }
                })
            }
        }


        const computerChoice = () => {
            const boxes = document.getElementsByClassName("box");
            let total = 0;
            Object.values(boxes).forEach(box => {
                if (!box.textContent) {
                    total += 1
                }
            })
            if (total > 6) {
                randomMove();
            } else {
                checkRows()
            }
        }

        return { computerChoice }

    })()


    const fillBoxSingle = () => {
        const boxes = document.getElementsByClassName("box");
        for (box of boxes) {
            box.addEventListener("click", (e) => {
                if (!e.target.textContent) {
                    e.target.textContent = "X";
                    populateTable(e.target.textContent, ...Object.values(e.target.dataset))
                    computerTurn.computerChoice()
                    //checkVictory(player);
                }
            })
        }
    }


    const fillBox = () => {
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
    }

    const swapPlayers = () => {
        if (playerOne.turn === true) {
            playerOne.turn = false;
            return playerOne
        } else {
            playerOne.turn = true;
            return playerTwo
        }
    }


    return { fillBoxSingle, emptyBoard, computerTurn, rows }

})()











/*
legare player.score a html [X]
azzerare rows quando emptyRows [X]
azzerare rows e punteggio quando newGame [X]
bloccare partita quando si vince [X]
bloccare partita quando si pareggia [X]
aggiungere pareggio sotto i due playerscore [X]
aggiungere AI [X]
Sostituire forEach loop con for loop in computerTurn [X]
rendere computer == player2
modificare form quando si seleziona single player/multiplayer
modificare grafica sito
*/