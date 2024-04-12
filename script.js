var board = [];
var rows = 8;
var cols = 8;
var mineCount = 5;
var mineLocations = [];
var clicked = 0;
var flagged = false;
var flagCount = 0;
var gameOver = false;
var startTime;
var timerInterval;
window.onload = function () {
    startTimer();
    startGame();
};
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}
function updateTimer() {
    var currentTime = Date.now();
    var elapsedTime = Math.floor((currentTime - startTime) / 1000);
    var minutes = Math.floor(elapsedTime / 60);
    var seconds = elapsedTime % 60;
    var formattedSeconds = seconds < 10 ? "0".concat(seconds) : "".concat(seconds);
    var timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = "".concat(minutes, ":").concat(formattedSeconds);
    }
}
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
function emplaceMines() {
    // mineLocations.push("1,1");
    // mineLocations.push("1,2");
    // mineLocations.push("1,3");
    // mineLocations.push("2,1");
    // mineLocations.push("2,3");
    // mineLocations.push("3,3");
    // mineLocations.push("3,2");
    // mineLocations.push("3,1");
    var rem = mineCount;
    while (rem > 0) {
        var f = Math.floor(Math.random() * rows);
        var g = Math.floor(Math.random() * cols);
        var id = f.toString() + "," + g.toString();
        if (!mineLocations.includes(id)) {
            mineLocations.push(id);
            rem--;
        }
    }
}
function startGame() {
    document.getElementById("mines-count").innerText = mineCount;
    document.getElementById("flag-button").addEventListener("click", setFlags);
    emplaceMines();
    for (var i = 0; i < rows; ++i) {
        var curr = [];
        for (var j = 0; j < cols; ++j) {
            var tile = document.createElement("div");
            tile.id = i.toString() + "," + j.toString();
            tile.addEventListener("click", revealTile);
            document.getElementById("board").append(tile);
            curr.push(tile);
        }
        board.push(curr);
    }
    console.log(board);
    console.log(mineLocations);
}
function setFlags() {
    if (flagged) {
        flagged = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagged = !false;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
    return;
}
function revealTile() {
    var tile = this;
    if (gameOver || this.classList.contains("clicked-tile")) {
        return;
    }
    if (flagged && flagCount < mineCount) {
        var prev = tile.innerText;
        tile.innerText = tile.innerText == "" ? "🚩" : "";
        if (prev === "🚩") {
            flagCount--;
        }
        else {
            flagCount++;
        }
        tile.classList.add("flagged-tile");
    }
    console.log(tile.id);
    if (mineLocations.includes(tile.id) && !flagged) {
        //alert("GAMEOVER");
        gameOver = true;
        revealMines();
        stopTimer();
        return;
    }
    var currentLoc = tile.id.split(',');
    isMine(currentLoc[0], currentLoc[1], flagged);
}
function isMine(x, y, isflagged) {
    if (isflagged) {
        return;
    }
    if (x < 0 || x >= rows || y < 0 || y >= cols) {
        console.log(`Invalid coordinates: (${x}, ${y})`);
        return;
    }
    if (board[x][y].classList.contains("clicked-tile")) {
        console.log(`Tile (${x}, ${y}) already clicked.`);
        return;
    }
    if (board[x][y] === undefined) {
        console.log(`Tile (${x}, ${y}) is undefined.`);
        return;
    }
    board[x][y].classList.add("clicked-tile");
    clicked += 1;
    var nearbyMines = 0;
    //above
    nearbyMines += checkTile(x - 1, y - 1);
    nearbyMines += checkTile(x - 1, y);
    nearbyMines += checkTile(x - 1, y + 1);
    //left and right
    nearbyMines += checkTile(x, y - 1);
    nearbyMines += checkTile(x, y + 1);
    //below
    nearbyMines += checkTile(x + 1, y - 1);
    nearbyMines += checkTile(x + 1, y);
    nearbyMines += checkTile(x + 1, y + 1);
    if (nearbyMines > 0) {
        board[x][y].innerText = nearbyMines;
        board[x][y].classList.add("t" + nearbyMines.toString());
    }
    else {
        //above
        isMine(x - 1, y - 1, flagged);
        isMine(x - 1, y, flagged);
        isMine(x - 1, y + 1, flagged);
        //sides
        isMine(x, y - 1, flagged);
        isMine(x, y + 1, flagged);
        //below
        isMine(x + 1, y - 1, flagged);
        isMine(x + 1, y, flagged);
        isMine(x + 1, y + 1, flagged);
    }
    if (clicked === rows * cols - mineCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        stopTimer();
        return;
    }
}
function checkTile(a, b) {
    // Check if coordinates are within the boundaries of the board
    if (a < 0 || a >= rows || b < 0 || b >= cols) {
        return 0;
    }
    // Check if the current tile is a mine
    if (mineLocations.includes("".concat(a, ",").concat(b))) {
        return 1;
    }
    return 0;
}
function revealMines() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var tile = board[i][j];
            if (mineLocations.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "darkred";
            }
        }
    }
}
