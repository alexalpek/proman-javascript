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
                <section class="board">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add card-add">Add Card</button>
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
        for (let button of cardAddButtons){
            button.addEventListener('click', dom.addCard)
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
        const parentBoard = document.getElementById(boardId);
        let statusIds = [];
        for (let element of parentBoard.children) {
            statusIds.push(element.id);
        }
        for (const card of cards) {
            const status = `${boardId}-status-`.concat(card.status_id),
                statusIndex = statusIds.indexOf(status);
            if (statusIndex === 0 || statusIndex !== 0 && statusIndex > -1) {

                const parentStatusId = `${boardId}-status-`.concat(statusIndex),
                    cardContainer = document.getElementById(parentStatusId);
                cardContainer.innerHTML += `
                <div class="card">
                  <div  class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                  <div class="card-title">${card.title}</div>
                  <div id="${parentStatusId}-${card.id}" class="card-content"</div>
                </div>`
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
                <div id="${boardId}-status-${status.title}" class="board-column">
                    <div class="board-column-title">${status.title}</div>
                    <div id="${boardId}-status-${status.id}" class="board-column-content">
                    </div>
                </div>     
            `;
            const statusContainer = document.getElementById(boardId);
            statusContainer.innerHTML = statusList;
        }
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
            newSection.innerHTML = `<div class="board-header"><span class="board-title">Board ${boardNumber}</span>
                    <button class="board-add card-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"><img class="icon" src="/static/images/close.png" alt="close" ></i></button>
                </div>
                <div id="board-${boardNumber}" class="board-columns">
                </div>`;
            let addCardButton = newSection.querySelector('.card-add');
            addCardButton.addEventListener('click', dom.addCard);
            document.querySelector('.board-container').appendChild(newSection);
            let lastToggleButton = document.querySelector('.board:last-child .board-toggle');
            lastToggleButton.addEventListener('click', dom.toggleBoard);
        });
    },

    addCard: function () {
        const thisBoard = this.closest('.board');
        const boardColumn = thisBoard.querySelector('.board-columns');
        const newColumn = boardColumn.querySelector('.board-column');
        let id = newColumn.getAttribute('id');
        let numberOfCards = newColumn.querySelectorAll('.card').length + 1;
        newColumn.querySelector('.board-column-content').innerHTML += `
                <div class="card">
                  <div  class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                  <div class="card-title">New Card ${numberOfCards}</div>
                  <div id="${id}-status-0-${numberOfCards - 1}" class="card-content"</div>
                </div>`


    },
};
