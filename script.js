const emptyBoard = () => {
    const boxes = document.getElementsByClassName("box");
    for (box of boxes) {
        box.textContent = ""
    }
}


const checkVictory = () => {
    Object.values(rows).forEach(array => {
        if (array.length == 3 && new Set(array).size == 1) {
            console.log("You won")
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
                e.target.textContent = "X"
                populateTable(e.target.textContent, ...Object.values(e.target.dataset))
                checkVictory()
            }

        })
    }
})()