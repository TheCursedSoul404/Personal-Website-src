import os
import psycopg2
import json

async def on_request(request):
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT quote FROM quotes ORDER BY random() LIMIT 1;")
    quote = cur.fetchone()[0]
    cur.close()
    conn.close()

    return {
        "status": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": json.dumps({"quote": quote})
    }