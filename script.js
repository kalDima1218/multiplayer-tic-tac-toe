const socket = new WebSocket("ws://" + window.location.host + "/ws");

let board = ["", "", "", "", "", "", "", "", ""];
let turn = "X";
let winner = null;

$(".cell").click(function() {
  if (!winner) {
    const cellId = $(this).attr("id");
    const cellIndex = parseInt(cellId.split("-")[1]);
    if (board[cellIndex] === "") {
      board[cellIndex] = turn;
      $(this).addClass(turn.toLowerCase());
      $(this).text(turn);
      checkWinner();
      if (!winner) {
        turn = turn === "X" ? "O" : "X";
      }
      sendBoard();
    }
  }
});

function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      $(`#cell-${a}`).addClass("winner");
      $(`#cell-${b}`).addClass("winner");
      $(`#cell-${c}`).addClass("winner");
      break;
    }
  }
}

function sendBoard() {
  const message = {
    data: board,
    turn: turn,
    winner: winner
  };
  socket.send(JSON.stringify(message));
}

socket.onmessage = function(event) {
  const message = JSON.parse(event.data);
  board = message.data;
  turn = message.turn;
  winner = message.winner;
  console.log(board);
  for (let i = 0; i < board.length; i++) {
    const cell = $(`#cell-${i}`);
    cell.removeClass("x o winner");
    cell.text(board[i]);
    if (board[i] === "X") {
      cell.addClass("x");
    } else if (board[i] === "O") {
      cell.addClass("o");
    }
    if (winner) {
      cell.addClass("winner");
    }
  }
};
