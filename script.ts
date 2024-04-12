let board: any = [];
const rows = 8;
const cols = 8;

let mineCount: any = 5;
let mineLocations: any = [];

let clicked = 0;
let flagged = false;
let flagCount = 0;

let gameOver = false;

let startTime;
let timerInterval;

window.onload = () => {
	startTimer();
	startGame();
}


function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer(): void {
    const currentTime: number = Date.now();
    const elapsedTime: number = Math.floor((currentTime - startTime) / 1000);
    const minutes: number = Math.floor(elapsedTime / 60);
    const seconds: number = elapsedTime % 60;
    const formattedSeconds: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const timerElement: HTMLElement | null = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = `${minutes}:${formattedSeconds}`;
    }
}

function stopTimer(): void {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function emplaceMines(){
	// mineLocations.push("1,1");
    // mineLocations.push("1,2");
    // mineLocations.push("1,3");
    // mineLocations.push("2,1");
    // mineLocations.push("2,3");
    // mineLocations.push("3,3");
    // mineLocations.push("3,2");
    // mineLocations.push("3,1");

    let rem = mineCount;
    while (rem > 0){
    	let f = Math.floor(Math.random() * rows);
    	let g = Math.floor(Math.random() * cols);
    	let id = f.toString() + "," + g.toString();

    	if(!mineLocations.includes(id)){
    		mineLocations.push(id);
    		rem--;
    	}
    }
}


function startGame(){
	document.getElementById("mines-count")!.innerText = mineCount;
	document.getElementById("flag-button")!.addEventListener("click", setFlags);
	emplaceMines();

	for (let i = 0; i < rows; ++i){
		let curr: any = [];
		for (let j = 0; j < cols; ++j){
			let tile = document.createElement("div")
			tile.id = i.toString() + "," + j.toString();
			
			tile.addEventListener("click", revealTile);

			document.getElementById("board")!.append(tile);
			curr.push(tile);
		}
		board.push(curr);
	}

	console.log(board);
	console.log(mineLocations);
}

function setFlags(){
	if(flagged){
		flagged = false;
		document.getElementById("flag-button")!.style.backgroundColor = "lightgray";
	}else{
		flagged = !false;
		document.getElementById("flag-button")!.style.backgroundColor = "darkgray";
	}return;
}

function revealTile(){
	let tile = this;

	if (gameOver || this.classList.contains("clicked-tile")){
		return;
	}

	if (flagged && flagCount < mineCount){
		let prev = tile.innerText;
		tile.innerText = tile.innerText == "" ? "🚩" : "";
		if (prev === "🚩"){
			flagCount--;
		}else{flagCount++;}
		tile.classList.add("flagged-tile");
	}


	console.log(tile.id)
	if (mineLocations.includes(tile.id) && !flagged){
		//alert("GAMEOVER");
		gameOver = true;
		revealMines();
		stopTimer();
		return;
	}

	let currentLoc = tile.id.split(',');
	isMine(currentLoc[0], currentLoc[1], flagged);

}

function isMine(x, y, isflagged){
	if(isflagged){
		return;
	}
	if (x < 0 || x >= rows || y < 0 || y >= cols){
		return;
	}
	if (board[x][y].classList.contains("clicked-tile")){
		return;
	}

	board[x][y].classList.add("clicked-tile");
	clicked += 1;

	let nearbyMines = 0;
	//above
	nearbyMines += checkTile(x-1, y-1);
	nearbyMines += checkTile(x-1, y);
	nearbyMines += checkTile(x-1, y+1);

	//left and right
	nearbyMines += checkTile(x, y-1);
	nearbyMines += checkTile(x, y+1);

	//below
	nearbyMines += checkTile(x+1, y-1);
	nearbyMines += checkTile(x+1, y);
	nearbyMines += checkTile(x+1, y+1);

	if (nearbyMines > 0){
		board[x][y].innerText = nearbyMines;
		board[x][y].classList.add("t" + nearbyMines.toString());
	}else{
		//above
		isMine(x-1,y-1,flagged);
		isMine(x-1,y,flagged);
		isMine(x-1,y+1,flagged);

		//sides
		isMine(x, y-1,flagged);
		isMine(x, y+1,flagged);

		//below
		isMine(x+1,y-1,flagged);
		isMine(x+1,y,flagged);
		isMine(x+1,y+1,flagged);

	}

	if (clicked === rows*cols - mineCount){
		document.getElementById("mines-count")!.innerText = "Cleared";
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
    if (mineLocations.includes(`${a},${b}`)) {
        return 1;
    }

    return 0;
}

function revealMines(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let tile = board[i][j];
            if (mineLocations.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "darkred";                
            }
        }
	}
}

document.getElementById("clear-game-button")?.addEventListener("click", function() {
    stopTimer();
    document.getElementById("player-input")!.style.display = "block";
});

document.getElementById("submit-score-button")?.addEventListener("click", function() {
    const playerNameInput: HTMLInputElement | null = document.getElementById("player-name") as HTMLInputElement;
    if (!playerNameInput) return;
    const playerName: string = playerNameInput.value;
    const time: string = document.getElementById("timer")?.innerText || "0:00"; // Get the formatted time
    saveScore(playerName, time);
});

function saveScore(playerName: string, time: string): void {
    // Create XML data
    const xmlString: string = `<score><player>${playerName}</player><time>${time}</time></score>`;

    // Send XML data to the server for storage or save it locally
    console.log("Saving score:", xmlString);
}