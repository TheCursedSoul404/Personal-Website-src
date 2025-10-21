import random
import psycopg2
from flask import Flask, request, jsonify

#================================ Helper Functions & Variables =====================================

app = Flask(__name__)

def ConnectToDB():
    return psycopg2.connect(
    dbname="Quotes-DB",
    user="postgres",
    password="ShinyGallade7",
    host="localhost",
    port=5432
)

connect = ConnectToDB()
cursor = connect.cursor()



#======================================= Flask Routes ==============================================

@app.route("/quotes/random", methods=["GET"])
def getRandomQuote():
    connect = ConnectToDB()
    cursor = connect.cursor()

    cursor.execute("SELECT quote FROM QUOTES ORDER BY RANDOM() LIMIT 1;")
    
    rows = cursor.fetchall()
    cursor.close()
    connect.close()

    return jsonify({"quote": rows[0][0]})                                         # return the requested years in a JSON (the "how" for this is jsonify())

#===================================================================================================

if __name__ == '__main__':                                              # Don't forget call the main!
    app.run(debug=True)

#==================================================================================================