// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    clearBoardContainer: function () {
        const boardContainer = document.querySelector('#boards');
        boardContainer.innerHTML = '';
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.clearBoardContainer();
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';
        for (let board of boards) {
            boardList += `
                <section class="board" data-id-num="${board.id}">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add card-add">Add Card</button>
                    <button class="board-delete"><img class="icon" src="/static/images/delete.png" alt="remove board"></button>
                    <button data-toggle="" class="board-toggle"><i class="fas fa-chevron-down"><img class="icon" src="/static/images/close.png" alt="close" ></i></button>
                </div>
                <div id="board-${board.id}" class="board-columns">
                </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                        <div><button id="add-board" class="board-add">Add Board</button></div>

                ${boardList}
            </div>
        `;

        const boardContainer = document.querySelector("#boards");
        boardContainer.insertAdjacentHTML('beforeend', outerHtml);

        const toggleButtons = document.querySelectorAll('.board-toggle');
        for (let button of toggleButtons) {
            button.addEventListener('click', function (event) {
                dom.toggleBoard(event);
            })
        }
        dom.addBoard();
        let cardAddButtons = document.querySelectorAll('.card-add'); // REFACTOR
        for (let button of cardAddButtons) {
            button.addEventListener('click', dom.addCard)
        }
        let deleteButtons = document.querySelectorAll(".board-delete");
        for (let button of deleteButtons) {
            button.addEventListener('click', dom.deleteBoard)
        }

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called

        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards, boardId)
        })
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        const parentBoard = document.getElementById(boardId),
            statuses = parentBoard.children;
        for (const card of cards) {
            for (let status of statuses) {
                if (parseInt(status.id) === card.status_id)
                    status.lastElementChild.innerHTML += `
                        <div class="card">
                          <div class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                          <div class="card-title">${card.title}</div>
                          <div id="${card.id}" class="card-content"</div>
                        </div>`;

                    let deleteButton = parentBoard.querySelector(".card-remove button");
                    deleteButton.addEventListener('click', function () {dom.deleteCard(card.id)})
            }
        }
    },
    clearStatusContainer: function (boardId) {
        const statusContainer = document.getElementById(boardId);
        statusContainer.innerHTML = '';

    },
    loadStatuses: function (boardId) {
        dataHandler.getStatuses(function (statuses) {
            dom.clearStatusContainer(boardId);
            dom.showStatuses(statuses, boardId);
            dom.loadCards(boardId)
        });
    },
    showStatuses: function (statuses, boardId) {
        let statusList = '';
        for (let status of statuses) {
            statusList += `
                <div id="${status.id}" class="board-column">
                    <div class="board-column-title">${status.title}</div>
                    <div id="${status.id}" class="board-column-content">
                    </div>
                </div>     
            `;
            const statusContainer = document.getElementById(boardId);
            statusContainer.innerHTML = statusList;
        }
    },
    deleteBoard: function () {
        const board = this.closest("section");
        let boardId = board.dataset.idNum;
        dataHandler.deleteBoard({"id": `${boardId}`, "to": "boards"});
        board.remove();
    },
    toggleBoard: function (event) {
        const button = event.currentTarget,
            boardId = button.closest(".board").lastElementChild.id;
        if (button.dataset.toggle === "visible") {
            button.dataset.toggle = "not-visible";
            button.innerHTML = `<img class="icon" src="/static/images/close.png" alt="close" >`;
            dom.clearStatusContainer(boardId)
        } else {
            button.dataset.toggle = "visible";
            button.innerHTML = `<img class="icon" src="/static/images/view.png" alt="view" >`;
            dom.loadStatuses(boardId);
        }

    },
    addBoard: function () {
        const addButton = document.querySelector('#add-board');
        addButton.addEventListener('click', function () {
            const boardNumber = document.querySelectorAll('.board').length + 1;
            let newSection = document.createElement('section');
            newSection.classList.add('board');
            newSection.setAttribute("data-id-num", `${boardNumber}`);
            newSection.innerHTML = `<div class="board-header"><span class="board-title">Board ${boardNumber}</span>
                    <button class="board-add card-add">Add Card</button>
                    <button class="board-delete"><img class="icon" src="/static/images/delete.png" alt="remove board"></button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"><img class="icon" src="/static/images/close.png" alt="close" ></i></button>
                </div>
                <div id="board-${boardNumber}" class="board-columns">
                </div>`;
            let addCardButton = newSection.querySelector('.card-add');
            addCardButton.addEventListener('click', dom.addCard);
            document.querySelector('.board-container').appendChild(newSection);
            dataHandler.createNewBoard({"id": `${boardNumber}`, "title": `Board ${boardNumber}`, "to": "boards"});
            let lastToggleButton = document.querySelector('.board:last-child .board-toggle');
            lastToggleButton.addEventListener('click', dom.toggleBoard);
            let deleteButton = newSection.querySelector(".board-delete");
            deleteButton.addEventListener('click', dom.deleteBoard)
        });
    },
    deleteCard: function (cardId) {
      let deleteButton = event.currentTarget,
          card = deleteButton.closest("div").parentElement;
      dataHandler.deleteCard({"id": `${cardId}`, "to": "cards"});
      card.remove()
    },
    addCard: function () {
        const thisBoard = this.closest('.board');
        const boardColumn = thisBoard.querySelector('.board-columns');
        const newColumn = boardColumn.querySelector('.board-column');
        let cardId = parseInt(dataHandler._api_get('/get-card-id')) + 1;
        let numberOfCards = newColumn.querySelectorAll('.card').length + 1;
        newColumn.querySelector('.board-column-content').innerHTML += `
                <div class="card">
                  <div class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                  <div class="card-title">New Card ${numberOfCards}</div>
                  <div id="${cardId}" class="card-content"</div>
                </div>`;
        let boardId = thisBoard.dataset.idNum;
        dataHandler.createNewCard({
            "board_id": boardId,
            "title": `New Card ${numberOfCards}`,
            "status_id": "0",
            "card_order": `${numberOfCards - 1}`,
            "to": "cards"
        });
        let removeButtons = thisBoard.querySelectorAll(".card-remove button");
        let deleteButton = removeButtons[removeButtons.length - 1];
        deleteButton.addEventListener('click', function () {dom.deleteCard(cardId)})
    },
};
