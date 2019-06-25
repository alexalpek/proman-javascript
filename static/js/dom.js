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
                <div id="${board.id}" class="board-columns">
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


        const boardTitles = document.querySelectorAll('.board-title');
        for (let boardTitle of boardTitles) {
            let parentElement = boardTitle.parentElement;
            let boardId = parentElement.nextElementSibling.getAttribute('id');
            dom.changeElementIntoFormWhenClicked(boardTitle, parentElement, boardId);
        }

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
        const parentBoard = document.getElementById(boardId),
            statuses = parentBoard.children;
        for (const card of cards) {
            for (let status of statuses) {
                if (parseInt(status.id) === card.status_id)
                    status.lastElementChild.innerHTML += `
                        <div class="card">
                          <div  class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                          <div class="card-title">${card.title}</div>
                          <div id="${card.id}" class="card-content"</div>
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
                <div id="${boardNumber}" class="board-columns">
                </div>`;
            let addCardButton = newSection.querySelector('.card-add');
            addCardButton.addEventListener('click', dom.addCard);
            document.querySelector('.board-container').appendChild(newSection);
            let lastToggleButton = document.querySelector('.board:last-child .board-toggle');
            lastToggleButton.addEventListener('click', dom.toggleBoard);

            const boardTitle = newSection.querySelector('.board-title');
            const parentElement = boardTitle.parentElement;
            const boardId = parentElement.nextElementSibling.getAttribute('id');

            dom.changeElementIntoFormWhenClicked(boardTitle, parentElement, boardId);
        });
    },

    addCard: function () {
        const thisBoard = this.closest('.board');
        const boardColumn = thisBoard.querySelector('.board-columns');
        const newColumn = boardColumn.querySelector('.board-column');
        let numberOfCards = newColumn.querySelectorAll('.card').length + 1;
        newColumn.querySelector('.board-column-content').innerHTML += `
                <div class="card">
                  <div  class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                  <div class="card-title">New Card ${numberOfCards}</div>
                  <div id="${numberOfCards}" class="card-content"</div>
                </div>`
    },
    replaceTag: function (tagToChange, tagToPutIn) {
        tagToChange.parentElement.replaceChild(tagToPutIn, tagToChange);
    },
    createForm: function (boardId, originalValue) {
        const form = document.createElement('form');
        form.setAttribute('id', 'postData');
        form.setAttribute('method', 'post');

        const input = document.createElement('input');
        input.setAttribute('class', 'board-title');
        input.setAttribute('id', 'title-input');
        input.setAttribute('name', 'title-input');
        input.setAttribute('data-original-value', originalValue);
        input.setAttribute('data-board-id', boardId);

        form.appendChild(input);


        input.addEventListener('keydown', function(event) {
            if (event.isComposing || event.key === 13) {
                form.submit();
            }
        });

        form.addEventListener('submit', dom.postData);

        return form;
    },
    postData: function (event) {
        event.preventDefault();

        const title = document.querySelector('#title-input');

        dataHandler.renameBoard(title.dataset.boardId, title.value);

        const form = document.querySelector('#postData');
        const parentElement = form.parentElement;
        const boardId = parentElement.nextElementSibling.getAttribute('id');

        parentElement.insertAdjacentHTML('afterbegin', `<span class="board-title">${title.value}</span>`);
        form.remove();

        dom.changeElementIntoFormWhenClicked(parentElement.firstElementChild, parentElement, boardId);
    },
    checkIfQueryExists: function (query) {
        return document.querySelector(query);
    },
    changeElementIntoFormWhenClicked: function (element, parentElement, boardId) {
        const currentName = element.textContent;

        element.addEventListener('click', function() {
        if (dom.checkIfQueryExists('#title-input') === null) {
            dom.replaceTag(element, dom.createForm(boardId, element.textContent));

            const createdElement = document.querySelector('#title-input');
            createdElement.focus();
            createdElement.addEventListener('blur', function () {
                createdElement.parentElement.insertAdjacentHTML('afterbegin', `<span class="board-title">${currentName}</span>`);
                createdElement.remove();

                dom.changeElementIntoFormWhenClicked(parentElement.firstElementChild, parentElement, boardId);
            })
        }
    });
    },
    /*changeToTitleIfNotTarget: function (element) {

    }*/
};