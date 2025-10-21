import csv
import psycopg2

def createTables(connect):
    cur = connect.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS QUOTES (
            QID SERIAL PRIMARY KEY,
            Quote TEXT NOT NULL,
            Author TEXT,
            Tag(s) TEXT
        );
    """)
    connect.commit()
    cur.close()

def loadQuotes():

def main():
    connect = psycopg2.connect(
        dbname="",
        user="",
        password="",
        host="",
        port=5432
    )

    createTables(connect)

    print("Data loaded successfully!")

    connect.close()

if __name__ == "__main__":
    main()