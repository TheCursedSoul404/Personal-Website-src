import random
import psycopg2
from flask_cors import CORS
from flask import Flask, render_template, jsonify

#================================ Helper Functions & Variables =====================================

app = Flask(__name__)
CORS(app)

def ConnectToDB():
    connect = psycopg2.connect(
        dbname="postgres",
        user="postgres.rjkcuozuyhbbbnxojjhl",
        password="MegaFeraligator10",
        host="aws-1-us-east-2.pooler.supabase.com",
        port=5432,
        sslmode="require"
    )
    return connect


#======================================= Flask Routes ==============================================

@app.route("/quotes/random", methods=["GET"])
def getRandomQuote():
    connect = ConnectToDB()
    cursor = connect.cursor()
    cursor.execute("SELECT quote FROM QUOTES ORDER BY RANDOM() LIMIT 1;")
    quote = cursor.fetchone()[0]
    cursor.close()
    connect.close()
    return jsonify({"quote": quote})
#===================================================================================================

if __name__ == '__main__':                                              # Don't forget call the main!
    app.run(debug=True)

#===================================================================================================