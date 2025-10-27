import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SUPABASE_FUNCTION_URL = "https://rjkcuozuyhbbbnxojjhl.supabase.co/functions/v1/random-quote"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2N1b3p1eWhiYmJueG9qamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDYwMTMsImV4cCI6MjA3Njc4MjAxM30.w9MCITb2YGQf_qwFjZ2JilzbJGnSAl5UP2ijCoDJZK4"

@app.route("/quotes/random", methods=["GET"])
def getRandomQuote():
    headers = {
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(SUPABASE_FUNCTION_URL, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as req_err:
        print("Request error:", req_err)
        return jsonify({"error": str(req_err)}), 500
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)