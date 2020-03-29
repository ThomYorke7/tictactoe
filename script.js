// Main Gameboard App

const gameboard = (() => {

    const boxes = document.getElementsByClassName("box");

    // The arrays in the object are used to store selectors
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

    // Checks whether there are three identical selectors in one of the grid lines, otherwise calls checkTie()
    const checkVictory = (player) => {
        let victory = false
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
                victory = true
            } else {
                checkTie()
            }
        })
        return { victory }
    }


    // Checks whether all the grid lines are full
    const checkTie = () => {
        if (Object.values(rows).every(i => i.length == 3)) {
            setTimeout(emptyBoard, 2000)
        }
    }


    // Populates the 'rows' object with the players' selectors
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


    // Empties the board and the 'rows' object
    const emptyBoard = () => {
        for (box of boxes) {
            box.textContent = ""
        }
        Object.values(rows).forEach(arr => {
            arr.length = 0
        })
    }


    // Includes the computer logic
    const computerTurn = (() => {

        // Picks a random box and populates it if it's empty
        const randomMove = () => {
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

        // Populates the rows indicated by the position parameter
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

        // Checks if there are lines with two of the same selector, and returns the chance to win or block the player
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

            // Calls checkRows and if there are no chance to win or block the player, fills one line
            const move = checkMatchpoint()
            if (move == 0) {
                Object.entries(rows).some(([key, array]) => {
                    if ((array.length == 1 || array.length == 2) && array.includes("O")) {
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
                        }
                    }
                })
            }
        }

        // Counts the empty boxes and calls randomMove or checkRows based on the quantity
        const computerChoice = () => {
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

    // Fills the grid with the player choice, calls the computer logic and checks for victory
    const fillBoxSingle = () => {
        for (box of boxes) {
            box.addEventListener("click", (e) => {
                if (!e.target.textContent) {
                    e.target.textContent = "X";
                    populateTable(e.target.textContent, ...Object.values(e.target.dataset))
                    if (!checkVictory(playerOne).victory) {
                        computerTurn.computerChoice()
                        checkVictory(playerTwo)
                    }
                }
            })
        }
    }

    // Fills the grid with the two players' choices and checks for victory
    const fillBoxMulti = () => {
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

    // Feeds the right player to fillBoxMulti()
    const swapPlayers = () => {
        if (playerOne.turn === true) {
            playerOne.turn = false;
            return playerOne
        } else {
            playerOne.turn = true;
            return playerTwo
        }
    }


    return { fillBoxSingle, fillBoxMulti, emptyBoard }

})()


// Players Creation
const playerFactory = (name, selector, turn, score) => {
    return { name, selector, turn, score }
}

let playerOne = playerFactory(document.getElementById("player1-name").textContent, "X", true, 0)
let playerTwo = playerFactory(document.getElementById("player2-name").textContent, "O", false, 0)


// New Game Creation
const newGame = (() => {
    document.getElementById("player1name-input").value = ""
    document.getElementById("player2name-input").value = ""
    const playerForm = document.getElementById("form")
    const radioButtons = document.querySelectorAll('input[type="radio"]')
    for (button of radioButtons) {
        button.addEventListener("click", () => {
            if (document.getElementById("multi").checked) {
                document.getElementById("player2name-container").style.display = "block"
            } else if (document.getElementById("single").checked) {
                document.getElementById("player2name-container").style.display = "none"
            }
        })
    }

    // Grabs the form inputs
    playerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let gameMode = document.querySelector('input[type="radio"]:checked');
        if (gameMode.value == "singleplayer") {
            for (item of document.getElementsByClassName("box")) {
                item.addEventListener("click", gameboard.fillBoxSingle())
            }
            document.getElementById("player2name-input").value = "Computer"
        } else if (gameMode.value == "multiplayer") {
            for (item of document.getElementsByClassName("box")) {
                item.addEventListener("click", gameboard.fillBoxMulti())
            }
        }
        document.getElementById("player1-name").textContent = document.getElementById("player1name-input").value;
        document.getElementById("player2-name").textContent = document.getElementById("player2name-input").value;
        document.getElementById("form-container").style.display = "none"
    })
})()


// Buttons Settings
document.getElementById("new-game").addEventListener("click", () => {
    window.location.reload();
})

document.getElementById("reset").addEventListener("click", gameboard.emptyBoard)