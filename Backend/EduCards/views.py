from django.http import HttpResponse

def home(request):
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>EduCards - Frontend Task</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin-top: 100px;
                background-color: #f5f5f5;
            }
            .message {
                font-size: 36px;
                color: #333;
                margin-bottom: 20px;
            }
            .emoji {
                font-size: 80px;
                margin: 30px 0;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                padding: 40px;
                max-width: 600px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="emoji">👨‍💻</div>
            <div class="message">Drin this is your job, everything else works :)</div>
            <p>If you need anything text me, if you break anything good luck!</p>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content)