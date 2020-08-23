function makeMazeLoop(maze, mazeSize, row, col) {
    let lst = ["up", "down", "left", "right"]

    while (true) {
        //進む方向を上下左右からランダムに選ぶ
        const d = lst[Math.floor(Math.random() * lst.length)]

        // 1つ先
        let r1 = row
        let c1 = col

        // 2つ先
        let r2 = row
        let c2 = col

        // 2次元座標を方角により足し引きする
        switch (d) {
            case "up":
                r1 = r1 - 1
                r2 = r2 - 2
                break
            case "down":
                r1 = r1 + 1
                r2 = r2 + 2
                break
            case "left":
                c1 = c1 - 1
                c2 = c2 - 2
                break
            case "right":
                c1 = c1 + 1
                c2 = c2 + 2
                break
        }

        // 2つ先地点が 1（壁）なら ok
        if (r2 < mazeSize && c2 < mazeSize && r2 >= 0 && c2 >= 0) {
            if (maze[r2][c2] == 1) {
                maze[r1][c1] = 0
                maze[r2][c2] = 0
                return { flag: true, row: r2, col: c2 }
            }
        }

        // dを削除
        lst = lst.filter(v => v != d)
        if (lst.length === 0) {
            break
        }
    }

    return { flag: false, row: -1, col: -1 }
}

export default function makeMaze(mazeSize) {
    // 地点用スタック配列
    const stack = []
    // 1で初期化した迷路の２次元配列
    let maze = Array(mazeSize).fill().map(() => Array(mazeSize).fill(1))
    // 最初の地点のための奇数配列を作る
    const odd = []
    for (let i = 0; i < mazeSize; i++) {
        if (i % 2 != 0) {
            odd.push(i)
        }
    }
    // ランダムな奇数の数字 row と col 二つ作成
    let row = odd[Math.floor(Math.random() * odd.length)]
    let col = odd[Math.floor(Math.random() * odd.length)]
    // その地点を最初の地点（0 通路）とする
    maze[row][col] = 0
    // 現在の地点としてスタックに保持
    stack.push([row, col])

    while (true) {
        if (stack.length === 0) {
            break
        }

        // 2つ先地点が 1（壁）なら ok
        const obj = makeMazeLoop(maze, mazeSize, row, col)

        if (obj.flag === false) {
            let p = stack.pop()
            row = p[0]
            col = p[1]
            continue
        }

        stack.push([obj.row, obj.col])
    }

    return maze
}