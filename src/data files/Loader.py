import csv
import psycopg2

#================================== The tables we're making for the database =======================

def createTables(connect):
    cursor = connect.cursor()

    # AUTHORS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS AUTHORS (
            AuthorID SERIAL PRIMARY KEY,
            AuthorName TEXT UNIQUE NOT NULL
        );
    """)

    # QUOTES
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS QUOTES (
            QID SERIAL PRIMARY KEY,
            Quote TEXT NOT NULL,
            AuthorID INTEGER REFERENCES AUTHORS(AuthorID)
        );
    """)

    # TAGS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS TAGS (
            TagID SERIAL PRIMARY KEY,
            TagName TEXT UNIQUE NOT NULL
        );
    """)

    # QUOTE-TAG LINK TABLE (many-to-many relationship)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS QUOTE_TAGS (
            QID INTEGER REFERENCES QUOTES(QID),
            TagID INTEGER REFERENCES TAGS(TagID),
            PRIMARY KEY (QID, TagID)
        );
    """)

    connect.commit()
    cursor.close()

#===================================================================================================

#================================== Loader Methods =================================================

def loadAuthors(connect):
    with open("Quote.csv", newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        cursor = connect.cursor()
        for row in reader:
            author = row["Author"].strip()
            cursor.execute("""
                INSERT INTO AUTHORS (AuthorName)
                VALUES (%s)
                ON CONFLICT (AuthorName) DO NOTHING;
            """, (author,))
        connect.commit()
        cursor.close()

def loadTags(connect):
    with open("Quote.csv", newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        cursor = connect.cursor()
        for row in reader:
            tags = [t.strip() for t in row["Tag(s)"].split(",")]
            for tag in tags:
                cursor.execute("""
                    INSERT INTO TAGS (TagName)
                    VALUES (%s)
                    ON CONFLICT (TagName) DO NOTHING;
                """, (tag,))
        connect.commit()
        cursor.close()

def loadQuotes(connect):
    with open("Quote.csv", newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        cursor = connect.cursor()
        for row in reader:
            quote_text = row["Quote"].strip()
            author_name = row["Author"].strip()

            # Look up AuthorID for the quote
            cursor.execute("SELECT AuthorID FROM AUTHORS WHERE AuthorName = %s;", (author_name,))
            author_id = cursor.fetchone()
            if author_id:
                author_id = author_id[0]
            else:
                # Shouldn't happen if loadAuthors() ran first, but just in case:
                cursor.execute("INSERT INTO AUTHORS (AuthorName) VALUES (%s) RETURNING AuthorID;", (author_name,))
                author_id = cursor.fetchone()[0]

            cursor.execute("""
                INSERT INTO QUOTES (Quote, AuthorID)
                VALUES (%s, %s)
                RETURNING QID;
            """, (quote_text, author_id))
        connect.commit()
        cursor.close()


#===================================================================================================

#==================================== Main function ================================================ 
def main():
    connect = psycopg2.connect(
        dbname="Quotes-DB",
        user="postgres",
        password="ShinyGallade7",
        host="localhost",
        port=5432
    )

    createTables(connect)
    loadAuthors(connect)
    loadTags(connect)
    loadQuotes(connect)

    print("The Data Has Loaded In The Tables With No Errors")

    connect.close()

if __name__ == "__main__":
    main()

#===================================================================================================