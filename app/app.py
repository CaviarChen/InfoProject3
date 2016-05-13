from flask import Flask, render_template
import json

with open('config.json') as data_file:
    config = json.load(data_file)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/observation')
def observation():
    return render_template('observation.html')

if __name__ == '__main__':
    app.debug = config['server']['debug']
    app.run(host=config['server']['host'], port=config['server']['port'])
