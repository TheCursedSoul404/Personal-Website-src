async def on_request(request):
    return {
        "status": 200,
        "headers": {"content-type": "text/plain"},
        "body": "Hello from Cloudflare Python!"
    }