// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    clearBoardContainer : function(){
        const boardContainer = document.querySelector('#boards');
        boardContainer.innerHTML = '';
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.clearBoardContainer();
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';
        for(let board of boards){
            boardList += `
                <section class="board">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down">WAKE ME UP</i></button>
                </div>
                <div id="board-${board.id}" class="board-columns">
                </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        const boardContainer = document.querySelector("#boards");
        boardContainer.insertAdjacentHTML('beforeend', outerHtml);

        const toggleButtons = document.querySelectorAll('.board-toggle');
        for (let button of toggleButtons) {
            button.addEventListener('click', dom.toggleBoard)
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
            console.log(card);
            const status = `${boardId}-status-`.concat(card.status_id),
                statusIndex = statusIds.indexOf(status);
            if (statusIndex === 0 || statusIndex !== 0 && statusIndex > -1) {

                const parentStatusId = `${boardId}-status-`.concat(statusIndex),
                    cardContainer = document.getElementById(parentStatusId);
                cardContainer.innerHTML += `
                <div class="card">
                  <div class="card-remove"><button><i class="fas fa-trash-alt"></button></i></div>
                  <div class="card-title">${card.title}</div>
                  <div id="${parentStatusId}-${card.id}" class="card-content"</div>
                </div>`
            }}


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
        }},
    toggleBoard: function () {
        const button = event.currentTarget,
              boardId = button.closest(".board").lastElementChild.id;
        if (button.innerHTML === "AWOKEN") {
            button.innerHTML = "WAKE ME UP";
            dom.clearStatusContainer(boardId)
        }
        else {
            button.innerHTML = "AWOKEN";
            dom.loadStatuses(boardId);
        }

    }

};
