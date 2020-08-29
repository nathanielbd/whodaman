# WhoDaMan

A Jeopardy! Game using [jService](http://jservice.io).

# Run locally

```
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python app.py
```

## Known bugs
- check if a username is already taken
- joining a room causes the player counter to go negative
- jumbotrons/title headers aren't really responsive