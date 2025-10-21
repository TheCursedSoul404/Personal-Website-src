import random
import psycopg2
from flask_cors import CORS
from flask import Flask, render_template, jsonify

#================================ Helper Functions & Variables =====================================

app = Flask(__name__)
CORS(app)

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

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/projects')
def projects():
    return render_template("projects.html")

@app.route('/recipes')
def recipes():
    return render_template("recipes.html")

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

#==================================================================================================