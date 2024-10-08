let grid = null;
const gridElement = document.getElementById('grid');

function setGrid() {
	grid = Array.from({ length: 9 }, () => Array(9).fill(0));
}

function canFill(tryNumber, row, col) {
	// col check.
	for (let r = 8; r >= 0; r--) {
		if (grid[r][col] === tryNumber) return false;
	}
	// row check
	for (let c = 8; c >= 0; c--) {
		if (grid[row][c] === tryNumber) return false;
	}
	// check sub-grid
	let rowSubGrid = Math.floor(row / 3) * 3;
	let colSubGrid = Math.floor(col / 3) * 3;
	for (let r = rowSubGrid; r < rowSubGrid + 3; r++) {
		for (let c = colSubGrid; c < colSubGrid + 3; c++) {
			if (grid[r][c] === tryNumber) {
				return false;
			}
		}
	}
	return true;
}
function solveBacktracking(row, col) {
	// move the next row.
	if (col === 9) {
		row++;
		col = 0;
	}
	if (row === 9) {
		return true;
	}
	if (grid[row][col] !== 0) {
		return solveBacktracking(row, col + 1);
	}
	for (let tryNumber = 1; tryNumber <= 9; tryNumber++) {
		if (canFill(tryNumber, row, col)) {
			grid[row][col] = tryNumber;
			if (solveBacktracking(row, col + 1)) {
				return true;
			}
			grid[row][col] = 0;
		}
	}
	return false;
}
function solveSudoku() {
	// if (!isValid()) {
	// 	return false;
	// }
	return solveBacktracking(0, 0);
}

function fillGrid(event) {
	event.preventDefault();
	setGrid();
	const formData = new FormData(event.currentTarget);
	for (const cell of formData.entries()) {
		const row = Number(cell[0][0]);
		const col = Number(cell[0][1]);
		const value = Number(cell[1][0] !== undefined ? cell[1][0] : 0);
		grid[row - 1][col - 1] = value;
	}
	console.log(grid);
	if (!solveSudoku()) {
		alert('Sudoku is unsolvable');
		return;
	}
	for (let i = 1; i <= 9; i++) {
		for (let j = 1; j <= 9; j++) {
			const cell = document
				.querySelector(`#grid .row:nth-child(${i})`)
				.querySelector(`.col:nth-child(${j})`);
			if (!cell.firstElementChild.value) {
				cell.firstElementChild.value = grid[i - 1][j - 1];
			}
		}
	}
}

gridElement.addEventListener('submit', fillGrid);
