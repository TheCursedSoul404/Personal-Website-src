# functions/api/quotes.py
import os
import psycopg2
import json
from flask import Response

def on_request(request):
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT quote FROM quotes ORDER BY random() LIMIT 1;")
    quote = cur.fetchone()[0]
    cur.close()
    conn.close()

    return Response(
        json.dumps({"quote": quote}),
        content_type="application/json"
    )