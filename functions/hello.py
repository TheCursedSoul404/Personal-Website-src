# functions/hello.py
def on_request(request):
    return Response("Hello from Cloudflare!", content_type="text/plain")