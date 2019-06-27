from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-board/<int:board_id>")
@json_response
def get_board(board_id: int):
    """
    Get board by id
    """
    return data_handler.get_board(board_id)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    Get all basic statuses
    """
    return data_handler.get_statuses()


@app.route("/rename-board/<int:board_id>", methods=['POST'])
@json_response
def rename_board(board_id: int):
    """
    Rename board
    """
    board_title = request.json['title']
    return data_handler.rename_board(board_id, board_title)


@app.route("/post-data", methods=['POST', 'PUT', 'DELETE'])
@json_response
def post_data():
    data = request.get_json()
    if request.method == "POST":
        if data['to'] == "boards":
            data_handler.add_board(data)
        elif data['to'] == "statuses":
            data_handler.add_status(data)
        elif data['to'] == "cards":
            data_handler.add_card(data)
    elif request.method == "PUT":
        if data['to'] == "boards":
            data_handler.rename_board(data)
        if data['to'] == "cards":
            data_handler.edit_card(data)
    elif request.method == "DELETE":
        if data['to'] == "boards":
            data_handler.delete_board(data)
        elif data['to'] == "statuses":
            data_handler.delete_status(data)
        elif data['to'] == "cards":
            data_handler.delete_card(data)
    else:
        print("fag, wrong stuff")


@app.route("/get-card-id")
@json_response
def get_card_data():
    return data_handler.get_latest_card_id()


@app.route("/get-board-id")
@json_response
def get_board_data():
    return data_handler.get_latest_board_id()


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
