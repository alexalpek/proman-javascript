import connection


@connection.connection_handler
def get_latest_card_id(cursor):
    cursor.execute("""
        SELECT cards_id_seq.last_value FROM cards_id_seq    
    """)
    card_id = cursor.fetchone()
    for i, k in card_id.items():
        return k


@connection.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute("""
        SELECT title FROM statuses
        WHERE id = %(status_id)s;
    """, {"status_id": int(status_id)})
    return cursor.fetchone()


@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""
        SELECT * FROM boards
        ORDER BY id;
    """)
    return cursor.fetchall()


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
        SELECT * FROM cards
        WHERE board_id = %(board_id)s
        ORDER BY card_order
    """, {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def rename_board(cursor, board_data):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(board_title)s
                    WHERE id = %(board_id)s;
                    """,
                   {"board_id": board_data['id'], "board_title": board_data['title']})


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
        SELECT * FROM statuses
    """)
    return cursor.fetchall()


@connection.connection_handler
def add_board(cursor, data):
    cursor.execute("""
        INSERT INTO boards
        VALUES (%(id)s, %(title)s)
    """, {"id": data['id'], "title": data['title']})


@connection.connection_handler
def add_status(cursor, data):
    cursor.execute("""
        INSERT INTO statuses
        VALUES (%(id)s, %(title)s)
    """, {"id": data['id'], "title": data['title']})


@connection.connection_handler
def add_card(cursor, data):
    cursor.execute("""
        INSERT INTO cards (board_id, title, status_id, card_order)
        VALUES ( 
                %(board_id)s, 
                %(title)s, 
                %(status_id)s, 
                %(card_order)s)
    """, {
        "board_id": data['board_id'],
        "title": data['title'],
        "status_id": data['status_id'],
        "card_order": data['card_order']
    })


@connection.connection_handler
def edit_board(cursor, data):
    pass


@connection.connection_handler
def edit_status(cursor, data):
    pass


@connection.connection_handler
def edit_card(cursor, data):
    pass


@connection.connection_handler
def delete_board(cursor, data):
    cursor.execute("""
        DELETE FROM boards
        WHERE id = %(id_)s
    """, {"id_": data['id']})


@connection.connection_handler
def delete_status(cursor, data):
    cursor.execute("""
        DELETE FROM statuses
        WHERE id = %(id_)s
    """, {"id_": data['id']})


@connection.connection_handler
def delete_card(cursor, data):
    cursor.execute("""
        DELETE FROM cards
        WHERE id = %(id_)s
    """, {"id_": data['id']})
