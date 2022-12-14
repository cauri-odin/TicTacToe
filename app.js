const board = (function() {
    const cells = Array(9)
    const initialize = () => cells.fill(null)
    const getCell = (id) => cells[id]
    const mark = (id, marker) => cells[id] = marker
    const isFull = () => cells.every(cell => !!cell)

    return { initialize, getCell, mark, isFull }
})()

const display = (function() {
    const secGameSettings = document.querySelector(".sec-game-settings")
    const secGame = document.querySelector(".sec-game")
    const btnStartGame = document.querySelector("#btn-start-game")
    const btnNewRound = document.querySelector('#btn-new-round')
    const cells = [...document.querySelectorAll(".cell")]

    toggleHidden = (...elements) => {
        for (const element of elements) {
            element.classList.toggle("hidden")
        }
    }

    btnStartGame.addEventListener("click", (e) => {
        e.preventDefault()
        const inputName1 =  document.querySelector("#input-name-1")
        const inputName2 = document.querySelector("#input-name-2")
        const name1 = inputName1.value.length > 0 ? inputName1.value : inputName1.placeholder
        const name2 = inputName2.value.length > 0 ? inputName2.value : inputName2.placeholder
        game.initialize(name1, name2)
        showBoard()
    })

    btnNewRound.addEventListener("click", () => {
        game.reset()
        updateMarks()
        update()
        toggleHidden(btnNewRound)
    })

    const setNames = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#name-" + i).textContent = game.getPlayer(i).name
        }
    }

    const setCurrent = () => {
        document.querySelector("#name-" + game.getCurrent()).classList.add("current")
    }

    const updateMarks = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#marker-" + i).textContent = game.getPlayer(i).marker
        }
    }

    const updateScores = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#score-" + i).textContent = game.getPlayer(i).score
        }
    }

    const updateCurrent = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#name-" + i).classList.toggle("current")
        }
    }

    const showBoard = () => {
        toggleHidden(btnStartGame, secGameSettings, secGame)

        setNames()
        setCurrent()
        updateMarks()
        updateScores()

        for (const cell of cells) {
            cell.textContent = ""
            cell.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id")
                game.mark(id)
                update()
            })
        }
    }

    const update = () => {
        updateCurrent()

        for (const cell of cells) {
            const id = cell.getAttribute('data-id')
            cell.textContent = board.getCell(id)
        }

        if (game.isOver()) {
            updateScores()
            btnNewRound.classList.remove("hidden")
        }
    }
})()

const game = (function() {
    let current = null
    let players = {}
    let winner = null

    const createPlayer = (name, isX) => ({ name, marker: isX ? "X" : "O", score: 0 })
    const getPlayer = (id) => players[id]
    const getCurrent = () => current
    const getWinner = () => winner

    const winConditions = [
        // rows:
        [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],

        // columns:
        [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],

        // diagonals:
        [ 0, 4, 8 ], [ 2, 4, 6 ],
    ]

    const isMet = (windCondition) => !!windCondition.reduce(
        (previousCell, id) => previousCell === board.getCell(id) ? previousCell : false,
        board.getCell(windCondition[0]))

    const hasWinner = () => winConditions.reduce(
        (hasWinner, current) => isMet(current) ? true : hasWinner,
        false)

    const isOver = () => hasWinner() || board.isFull()

    const initialize = (name1, name2) => {
        current = Math.round(Math.random(1)) + 1
        const player1 = createPlayer(name1, current === 1)
        const player2 = createPlayer(name2, current === 2)
        players = { "1": player1, "2": player2 }
        board.initialize()
    }

    const mark = (id) => {
        if (isOver() || board.getCell(id)) {
            return
        }

        board.mark(id, players[current].marker)

        if (hasWinner()) {
            winner = players[current]
            winner.score++
        }

        current = current === 1 ? 2 : 1
    }

    const reset = () => {
        board.initialize()
        for (let i = 1; i <= 2; i++) {
            players[i].marker = players[i].marker === "X" ? "O" : "X"
        }
    }

    return {
        initialize,
        reset,
        getCurrent,
        getPlayer,
        mark,
        isOver,
        hasWinner,
        getWinner,
    }
})()