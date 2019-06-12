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
                <div id="${board.id}" class="board-columns">
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
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    clearStatusContainer: function (boardId) {
        const statusContainer = document.getElementById(boardId);
        statusContainer.innerHTML = '';

    },
    loadStatuses: function (boardId) {
        dataHandler.getStatuses(function (statuses) {
            dom.clearStatusContainer(boardId);
            dom.showStatuses(statuses, boardId);
            });
    },
    showStatuses: function (statuses, boardId) {
        let statusList = '';
        for (let status of statuses) {
            statusList += `
                <div class="board-column">
                    <div id="${status.id} class="board-column-title">${status.title}</div>
                    <div class="board-column-content">
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
