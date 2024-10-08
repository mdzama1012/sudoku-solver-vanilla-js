let solvedGrid = null;
let unSolvedGrid = null;
let isSolvedMode = false;
const gridElement = document.getElementById('grid');

function fillGrid() {
	for (let row = 1; row <= 9; row++) {
		for (let col = 1; col <= 9; col++) {
			const cell = document
				.querySelector(`#grid .row:nth-child(${row})`)
				.querySelector(`.col:nth-child(${col})`);

			if (isSolvedMode) {
				cell.firstElementChild.value = unSolvedGrid[row - 1][col - 1]
					? unSolvedGrid[row - 1][col - 1]
					: '';
			} else {
				if (!cell.firstElementChild.value) {
					cell.firstElementChild.style.color = 'red';
				}
				cell.firstElementChild.value = solvedGrid[row - 1][col - 1];
			}
		}
	}
}

function setSolvedMode() {
	const solveButton = document.querySelector('.solve-btn');
	solveButton.innerHTML = '<i class="fa-solid fa-flask"></i> Un-solve';
	solveButton.style.backgroundColor = '#305cde';
}

function resetState() {
	document
		.querySelectorAll('input')
		.forEach(input => (input.style.color = 'blue'));
	if (isSolvedMode) {
		isSolvedMode = false;
		const solveButton = document.querySelector('.solve-btn');
		solveButton.innerHTML = '<i class="fa-solid fa-flask"></i> Solution';
		solveButton.style.backgroundColor = '#12a80d';
	}
}

function canFill(tryNumber, row, col) {
	// col check.
	for (let r = 8; r >= 0; r--) {
		if (solvedGrid[r][col] === tryNumber) return false;
	}
	// row check
	for (let c = 8; c >= 0; c--) {
		if (solvedGrid[row][c] === tryNumber) return false;
	}
	// check sub-grid
	let rowSubGrid = Math.floor(row / 3) * 3;
	let colSubGrid = Math.floor(col / 3) * 3;
	for (let r = rowSubGrid; r < rowSubGrid + 3; r++) {
		for (let c = colSubGrid; c < colSubGrid + 3; c++) {
			if (solvedGrid[r][c] === tryNumber) {
				return false;
			}
		}
	}
	return true;
}

function solveSudokuBacktracking(row, col) {
	if (col === 9) {
		row++;
		col = 0;
	}
	if (row === 9) {
		return true;
	}
	if (solvedGrid[row][col] !== 0) {
		return solveSudokuBacktracking(row, col + 1);
	}
	for (let tryNumber = 1; tryNumber <= 9; tryNumber++) {
		if (canFill(tryNumber, row, col)) {
			solvedGrid[row][col] = tryNumber;
			if (solveSudokuBacktracking(row, col + 1)) {
				return true;
			}
			solvedGrid[row][col] = 0;
		}
	}
	return false;
}

function isValidSudoku() {
	return true;
}

function setGrids() {
	solvedGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
	unSolvedGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
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
		// resetState();
		return;
	}
	if (!solveSudokuBacktracking(0, 0)) {
		alert('Sudoku is unsolvable!');
		// resetState();
		return;
	}
	setSolvedMode();
	fillGrid();
	isSolvedMode = true;
}

gridElement.addEventListener('submit', solveSudoku);
gridElement.addEventListener('reset', resetState);
document.addEventListener('DOMContentLoaded', resetState);
