from fastapi import FastAPI, Request

app = FastAPI()

@app.get('/')
def root():
    return {'ok': True}
