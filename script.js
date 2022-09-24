const gameBoard = (() => {
  const _board = ["", "", "", "", "", "", "", "", ""];
  const _magicBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const _convertToMagicNumber = () => {
    for (let i = 0; i < 9; i++) {
      _magicBoard[i] = _board[i] === "X" ? 1 : _board[i] === "O" ? -1 : 0;
    }
  };

  const _isEmpty = (index) => {
    return _board[index] ? false : true;
  };

  const _updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      document.querySelector(".board").children[i].textContent = _board[i];
    }
  };

  const _checkDraw = () => {
    for (let i = 0; i < 9; i++) {
      if (_isEmpty(i)) {
        return false;
      }
    }
    return true;
  };

  const gameOver = () => {
    let sum = 0;
    let flag = 0;
    // check rows
    for (let i = 0; i < 9; i += 3) {
      sum = _magicBoard[i] + _magicBoard[i + 1] + _magicBoard[i + 2];
      if (sum === 3 || sum === -3) {
        flag = 1;
        break;
      }
    }

    // for Columns
    for (let i = 0; i < 3; i++) {
      sum = _magicBoard[i] + _magicBoard[i + 3] + _magicBoard[i + 6];
      if (sum === 3 || sum === -3) {
        flag = 1;
        break;
      }
    }

    // for diagonals
    sum = _magicBoard[0] + _magicBoard[4] + _magicBoard[8];
    if (sum === 3 || sum === -3) {
      flag = 1;
    } else {
      sum = _magicBoard[2] + _magicBoard[4] + _magicBoard[6];
      if (sum === 3 || sum === -3) {
        flag = 1;
      }
    }

    if (flag) {
      return flag;
    }
    return _checkDraw();
  };

  const insert = (mark, index) => {
    if (_isEmpty(index)) {
      _board[index] = mark;
      _updateBoard(index);
      _convertToMagicNumber();
      return 1;
    } else {
      return 0;
    }
  };

  const reset = () => {
    _board.fill("");
    _magicBoard.fill(0);
    _updateBoard();
    document.querySelector(".board").classList.remove("inactive");
  };

  return { insert, gameOver, reset };
})();

const Player = (name, mark, cpu, currentTurn) => {
  let comp = cpu;
  const getMark = () => mark;
  const getCurrentTurn = () => currentTurn;
  const setCurrentTurn = (value) => (currentTurn = value);
  const getName = () => name;
  const isCpu = () => comp;
  const setCpu = (value) => (comp = value);
  return {
    getMark,
    getCurrentTurn,
    getName,
    setCurrentTurn,
    isCpu,
    setCpu,
  };
};

const game = (() => {
  let playerOne = null;
  let playerTwo = null;
  // 0 for cpu and 1 for player
  let _mode = "0";

  const _bindEvents = () => {
    document
      .querySelectorAll(".mode")
      .forEach((n) => n.addEventListener("click", _showBoard, true));
  };
  window.addEventListener("load", _bindEvents);

  const _endGame = () => {
    document.querySelector(".board").classList.add("inactive");
  };

  const _showBoard = (e) => {
    playerOne = Player("Roopaksh", "X", false, true);
    playerTwo = Player("player2", "O", false, false);
    e.target.classList.contains("player") ? (_mode = 1) : (_mode = 0);
    if (_mode == 0) {
      playerTwo.setCpu(true);
    }
    document.querySelector(".title-screen").classList.add("hidden");
    if (document.querySelector(".board") === null) {
      dynamicContent.createBoard();
      dynamicContent.backButton();
      dynamicContent.restartButton();
    } else {
      document.querySelector(".board").classList.remove("hidden");
      dynamicContent.toggleBackButton();
      dynamicContent.toggleRestartButton();
    }
  };

  const _setTurn = (pOne, pTwo) => {
    playerOne.setCurrentTurn(pOne);
    playerTwo.setCurrentTurn(pTwo);
  };

  const moveMade = (e) => {
    const index = Number(e.target.getAttribute("data-index"));
    if (playerOne.getCurrentTurn()) {
      if (gameBoard.insert(playerOne.getMark(), index)) {
        _setTurn(false, true);
      }
    }

    if (playerTwo.getCurrentTurn()) {
      if (playerTwo.isCpu()) {
        while (!gameBoard.insert(playerTwo.getMark(), bot.getCpuChoice())) {}
        _setTurn(true, false);
      } else if (gameBoard.insert(playerTwo.getMark(), index)) {
        _setTurn(true, false);
      }
    }

    if (gameBoard.gameOver()) {
      _endGame();
    }
  };

  return { moveMade };
})();

const dynamicContent = (() => {
  const _backToMenu = () => {
    gameBoard.reset();
    document.querySelector(".title-screen").classList.remove("hidden");
    document.querySelector(".board").classList.add("hidden");
    toggleBackButton();
    toggleRestartButton();
  };

  const createBoard = () => {
    const wrapper = document.querySelector(".wrapper");
    const board = document.createElement("div");
    wrapper.appendChild(board);
    board.classList.add("board");
    for (let i = 0; i < 9; i++) {
      const square = document.createElement("div");
      square.addEventListener("click", game.moveMade);
      square.classList.add("square");
      square.setAttribute("data-index", `${i}`);
      board.appendChild(square);
    }
  };

  const toggleRestartButton = () => {
    document.querySelector(".restart").classList.toggle("hidden");
  };

  const toggleBackButton = () => {
    document.querySelector(".back").classList.toggle("hidden");
  };

  const restartButton = () => {
    const wrapper = document.querySelector(".wrapper");
    button = document.createElement("button");
    button.textContent = "Restart";
    button.classList.add("restart");
    button.addEventListener("click", gameBoard.reset);
    wrapper.appendChild(button);
  };

  const backButton = () => {
    const wrapper = document.querySelector(".wrapper");
    button = document.createElement("button");
    button.textContent = "Back";
    button.classList.add("back");
    button.addEventListener("click", _backToMenu);
    wrapper.appendChild(button);
  };

  return {
    createBoard,
    restartButton,
    toggleRestartButton,
    backButton,
    toggleBackButton,
  };
})();

const bot = (() => {
  const getCpuChoice = () => Math.floor(Math.random() * 9);

  return { getCpuChoice };
})();
