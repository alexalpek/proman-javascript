import connection


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
        SELECT * FROM boards;
    """)
    return cursor.fetchall()


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
        SELECT * FROM cards
        WHERE board_id = %(board_id)s;
    """, {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
        SELECT * FROM statuses
    """)
    return cursor.fetchall()