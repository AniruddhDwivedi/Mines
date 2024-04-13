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
    if (gameOver || this.classList.contains("clicked-tile") || tile.innerText == "🚩") {
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
        console.log("Invalid coordinates: (".concat(x, ", ").concat(y, ")"));
        return;
    }
    if (!board[x] || !board[x][y]) {
        console.log("Tile (".concat(x, ", ").concat(y, ") is undefined."));
        return;
    }
    if (board[x][y].classList.contains("clicked-tile")) {
        console.log("Tile (".concat(x, ", ").concat(y, ") already clicked."));
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
        displayInputBox();
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
function displayInputBox() {
    var playerInput = document.getElementById("player-input");
    if (playerInput) {
        playerInput.style.display = "block";
    }
    document.getElementById("submit-score-button").addEventListener("click", function () {
        var _a;
        var playerNameInput = document.getElementById("player-name");
        if (!playerNameInput)
            return;
        var playerName = playerNameInput.value;
        var time = ((_a = document.getElementById("timer")) === null || _a === void 0 ? void 0 : _a.innerText) || "0:00"; // Get the formatted time
        saveScore(playerName, time);
    });
}
function saveScore(playerName, time) {
    // Create XML data
    var xmlString = "<score><player>".concat(playerName, "</player><time>").concat(time, "</time></score>");
    // Send XML data to the server for storage or save it locally
    console.log("Saving score:", xmlString);
}
function getLeaderBoard(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        if (event.target && event.target.result) {
            var xmlString = event.target.result;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");
            // Now you can work with the XML document (xmlDoc)
            console.log(xmlDoc);
        }
    };
    reader.readAsText(file);
}
// Example usage
// const inputFile = document.getElementById("input-file") as HTMLInputElement;
// inputFile.addEventListener("change", function(event) {
//     const files = event.target?.files;
//     if (files && files.length > 0) {
//         const selectedFile = files[0];
//         getLeaderBoard(selectedFile);
//     }
// });
