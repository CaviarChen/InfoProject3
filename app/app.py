from flask import Flask, render_template, abort
import json

with open('config.json') as data_file:
    config = json.load(data_file)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pivot')
def pivot():
    return render_template('pivot.html')

@app.route('/observation')
def observation():
    return render_template('observation.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/<method>')
def api(method):
    if(method=='PivotTable'):
        return 'test'

    abort(404)
    return ''


if __name__ == '__main__':
    app.debug = config['server']['debug']
    app.run(host=config['server']['host'], port=config['server']['port'])
