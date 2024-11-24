const board = document.querySelector('.board');
const addXButton = document.getElementById('addX');
const addOButton = document.getElementById('addO');

let currentPiece = 'x';

addXButton.addEventListener('click', () => {
    createPiece('x');
});

addOButton.addEventListener('click', () => {
    createPiece('o');
});

function createPiece(type) {
    const piece = document.createElement('div');
    piece.classList.add('piece', type);
    piece.draggable = true;

    piece.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', piece.id);
    });

    board.appendChild(piece);

    // Add event listener for dropping the piece onto a cell
    board.addEventListener('drop', (e) => {
        e.preventDefault();
        const pieceId = e.dataTransfer.getData('text/plain');
        const droppedPiece = document.getElementById(pieceId);
        const cell = e.target;

        // Position the piece within the cell
        droppedPiece.style.position = 'relative';
        droppedPiece.style.left = '0';
        droppedPiece.style.top = '0';

        cell.appendChild(droppedPiece);
    });
}