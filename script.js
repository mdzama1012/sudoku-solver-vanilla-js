const gridElement = document.getElementById('grid');
let isSolvedMode = false;
let solvedGrid = null;
// unsolved grid is used to unsolved state.
let unSolvedGrid = null;

// fill the grid according to the state.
function fillGrid() {
	for (let row = 1; row <= 9; row++) {
		for (let col = 1; col <= 9; col++) {
			const curCell = gridElement
				.querySelector(`.row:nth-child(${row})`)
				.querySelector(`.col:nth-child(${col})`);

			if (isSolvedMode) {
				curCell.firstElementChild.value = unSolvedGrid[row - 1][col - 1]
					? unSolvedGrid[row - 1][col - 1]
					: '';
			} else {
				// apply red color.
				if (!curCell.firstElementChild.value)
					curCell.firstElementChild.style.color = '#EF5A6F';
				curCell.firstElementChild.value = solvedGrid[row - 1][col - 1];
			}
		}
	}
}

// change the color to solution button -> un-solve button.
function setSolvedMode() {
	const solveButton = document.querySelector('.solve-btn');
	solveButton.innerHTML = '<i class="fa-solid fa-flask"></i> Un-solve';
	solveButton.style.backgroundColor = '#305cde';
}

// reset solvedGrid and unSolvedGrid.
function setGrids() {
	solvedGrid = unSolvedGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
}

// reset the UI and sudoku table.
function resetState() {
	document
		.querySelectorAll('input')
		.forEach(input => (input.style.color = '#4379F2'));
	if (isSolvedMode) {
		isSolvedMode = false;
		const solveButton = document.querySelector('.solve-btn');
		solveButton.innerHTML = '<i class="fa-solid fa-flask"></i> Solution';
		solveButton.style.backgroundColor = '#12a80d';
	}
}

function canFill(tryNumber, row, col) {
	// column check for repeating number.
	for (let r = 8; r >= 0; r--) {
		if (solvedGrid[r][col] === tryNumber) return false;
	}
	// row check for repeating number.
	for (let c = 8; c >= 0; c--) {
		if (solvedGrid[row][c] === tryNumber) return false;
	}
	// sub-grid check for repeating number.
	let rowSubGrid = Math.floor(row / 3) * 3;
	let colSubGrid = Math.floor(col / 3) * 3;
	for (let r = rowSubGrid; r < rowSubGrid + 3; r++) {
		for (let c = colSubGrid; c < colSubGrid + 3; c++) {
			if (solvedGrid[r][c] === tryNumber) return false;
		}
	}
	return true;
}

function solveSudokuBacktracking(row, col) {
	// move to the next row ⏭️
	if (col === 9) {
		row++;
		col = 0;
	}
	// we have fill all the rows so, we got a solution ✅
	if (row === 9) {
		return true;
	}
	// can't make any choice move to next cell
	if (solvedGrid[row][col] !== 0) {
		return solveSudokuBacktracking(row, col + 1);
	}
	for (let tryNumber = 1; tryNumber <= 9; tryNumber++) {
		if (canFill(tryNumber, row, col)) {
			solvedGrid[row][col] = tryNumber;
			if (solveSudokuBacktracking(row, col + 1)) return true;
			solvedGrid[row][col] = 0;
		}
	}
	return false;
}

// function to validate if the sudoku is correctly filled or not.
const isValid = (row, col) => {
	const targetNum = unSolvedGrid[row][col];
	if (targetNum === 0) return true;

	for (let r = row - 1; r >= 0; r--) {
		if (unSolvedGrid[r][col] === targetNum) return false;
	}
	for (let c = col - 1; c >= 0; c--) {
		if (unSolvedGrid[row][c] === targetNum) return false;
	}
	let rowSubGrid = Math.floor(row / 3) * 3;
	let colSubGrid = Math.floor(col / 3) * 3;
	for (let r = rowSubGrid; r < rowSubGrid + 3; r++) {
		for (let c = colSubGrid; c < colSubGrid + 3; c++)
			if (row !== r && col !== c && unSolvedGrid[r][c] === targetNum)
				return false;
	}
	return true;
};
function isValidSudoku() {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++)
			if (
				unSolvedGrid[row][col] < 0 ||
				grid[row][col] > 9 ||
				!isValid(row, col)
			)
				return false;
	}
	return true;
}

function solveSudoku(event) {
	event.preventDefault();
	if (isSolvedMode) {
		fillGrid();
		resetState();
		return;
	}
	setGrids();
	const formData = new FormData(event.currentTarget);
	for (const cell of formData.entries()) {
		const row = Number(cell[0][0]);
		const col = Number(cell[0][1]);
		if (cell[1][0]) {
			solvedGrid[row - 1][col - 1] = Number(cell[1][0]);
			unSolvedGrid[row - 1][col - 1] = Number(cell[1][0]);
		}
	}
	// console.log(solvedGrid);
	// console.log(unSolvedGrid);
	if (!isValidSudoku()) {
		alert('Please Enter Valid Sudoku!');
		return;
	}
	if (!solveSudokuBacktracking(0, 0)) {
		alert('Sudoku is unsolvable!');
		return;
	}
	setSolvedMode();
	fillGrid();
	isSolvedMode = true;
}

gridElement.addEventListener('reset', resetState);
gridElement.addEventListener('submit', solveSudoku);
document.addEventListener('DOMContentLoaded', resetState);
