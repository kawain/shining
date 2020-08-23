import makeMaze from "./maze.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const level1 = document.getElementById("level1")
const level2 = document.getElementById("level2")
const level3 = document.getElementById("level3")

let mazeSize
let cellSize
let isGameOver
let intervalID
let maze = []
let player = null
let enemy = []
// 敵の数
let enemyCount

class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = cellSize / 2
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = cellSize / 2
        // East West North South
        this.direction = "n"
    }
    move() {
        let x = this.x
        let y = this.y
        let d = this.direction

        if (d === "n") {
            if (maze[y][x - 1] === 0) {
                // 左
                x--
                d = "w"
            } else if (maze[y - 1][x] === 0) {
                // 前
                y--
                d = "n"
            } else {
                d = "e"
            }
        }

        if (d === "w") {
            if (maze[y + 1][x] === 0) {
                // 左
                y++
                d = "s"
            } else if (maze[y][x - 1] === 0) {
                // 前
                x--
                d = "w"
            } else {
                d = "n"
            }
        }

        if (d === "s") {
            if (maze[y][x + 1] === 0) {
                // 左
                x++
                d = "e"
            } else if (maze[y + 1][x] === 0) {
                // 前
                y++
                d = "s"
            } else {
                d = "w"
            }
        }

        if (d === "e") {
            if (maze[y - 1][x] === 0) {
                // 左
                y--
                d = "n"
            } else if (maze[y][x + 1] === 0) {
                // 前
                x++
                d = "e"
            } else {
                d = "s"
            }
        }

        this.x = x
        this.y = y
        this.direction = d
    }
}

function init() {
    isGameOver = false
    maze = []
    enemy = []
    let x
    let y
    // 迷路作成
    maze = makeMaze(mazeSize)
    // プレイヤーの初期位置(迷路2行目の0のランダム)
    while (true) {
        x = Math.floor(Math.random() * mazeSize)
        if (maze[1][x] === 0) {
            break
        }
    }
    // プレイヤー初期位置代入
    player = new Player(x, 1)

    // 敵の初期位置(迷路の0のランダム)
    while (true) {
        x = Math.floor(Math.random() * mazeSize)
        y = Math.floor(Math.random() * mazeSize)
        if (maze[y][x] === 0) {
            enemy.push(new Enemy(x, y))
            enemyCount--
        }
        if (enemyCount === 0) {
            break
        }
    }

    // ゴール位置(迷路の最終行のランダム)
    while (true) {
        x = Math.floor(Math.random() * mazeSize)
        if (maze[mazeSize - 2][x] === 0) {
            maze[mazeSize - 1][x] = 2
            break
        }
    }
}

function drawMaze() {
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "green"
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    }
}

function drawPlayer() {
    ctx.beginPath()
    ctx.arc(player.x * cellSize + player.radius, player.y * cellSize + player.radius, player.radius, 0, Math.PI * 2)
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.closePath()
}

function drawEnemy() {
    for (const v of enemy) {
        v.move()
        if (player.x === v.x && player.y === v.y) {
            ctx.fillStyle = "orange"
            isGameOver = true
        } else {
            ctx.fillStyle = "red"
        }
        ctx.beginPath()
        ctx.arc(v.x * cellSize + v.radius, v.y * cellSize + v.radius, v.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}

function gameOver() {
    clearInterval(intervalID)
    let text = "Game over"
    ctx.fillStyle = "red"
    ctx.font = "bold 60pt sans-serif"
    let metrics = ctx.measureText(text);
    let center = canvas.width / 2 - metrics.width / 2
    ctx.fillText(text, center, 250)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.strokeText(text, center, 250)
}

function gameClear() {
    clearInterval(intervalID)
    let text = "Game clear"
    ctx.fillStyle = "blue"
    ctx.font = "bold 60pt sans-serif"
    let metrics = ctx.measureText(text);
    let center = canvas.width / 2 - metrics.width / 2
    ctx.fillText(text, center, 250)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.strokeText(text, center, 250)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawMaze()
    drawPlayer()
    drawEnemy()
    if (isGameOver) {
        gameOver()
    }
    if (maze[player.y][player.x] === 2) {
        gameClear()
    }
}

document.addEventListener("keydown", (e) => {
    let x = player.x
    let y = player.y

    if (e.keyCode === 38) {
        // 上
        y--
    } else if (e.keyCode === 37) {
        // 左
        x--
    } else if (e.keyCode === 40) {
        // 下
        y++
    } else if (e.keyCode === 39) {
        // 右
        x++
    }

    if (y < mazeSize && (maze[y][x] === 0 || maze[y][x] === 2)) {
        player.x = x
        player.y = y
    }
})

level1.addEventListener("click", () => {
    mazeSize = 25
    cellSize = canvas.width / mazeSize
    enemyCount = 1
    init()
    intervalID = setInterval(draw, 100)
})

level2.addEventListener("click", () => {
    mazeSize = 35
    cellSize = canvas.width / mazeSize
    enemyCount = 5
    init()
    intervalID = setInterval(draw, 100)
})

level3.addEventListener("click", () => {
    mazeSize = 55
    cellSize = canvas.width / mazeSize
    enemyCount = 10
    init()
    intervalID = setInterval(draw, 100)
})


