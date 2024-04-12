let board: any = [];
const rows = 8;
const cols = 8;

let mineCount: any = 5;
let mineLocations: any = [];

let clicked = 0;
let flagged = false;

let gameOver = false;

window.onload = () => {
	startGame();
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

	if (flagged){
		tile.innerText = tile.innerText == "" ? "🚩" : "";
		this.classList.add("flagged-tile");
	}


	console.log(tile.id)
	if (mineLocations.includes(tile.id)){
		//alert("GAMEOVER");
		gameOver = true;
		revealMines();
		return;
	}

	let currentLoc = tile.id.split(',');
	isMine(currentLoc[0], currentLoc[1]);

}

function isMine(x, y){
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
		isMine(x-1,y-1);
		isMine(x-1,y);
		isMine(x-1,y+1);

		//sides
		isMine(x, y-1);
		isMine(x, y+1);

		//below
		isMine(x+1,y-1);
		isMine(x+1,y);
		isMine(x+1,y+1);

	}

	if (clicked === rows*cols - mineCount){
		document.getElementById("mines-count")!.innerText = "Cleared";
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