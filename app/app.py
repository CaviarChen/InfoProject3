from flask import Flask, render_template, abort, request, g
import handler
import json
import sqlite3



with open('config.json') as data_file:
    config = json.load(data_file)

app = Flask(__name__)

#-----------------------------------

def connect_db():
    return sqlite3.connect(config['server']['db_path'])

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

#-----------------------------------

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
        return json.dumps(handler.PivotTable(request.args, get_db()))

    abort(404)
    return ''

if __name__ == '__main__':
    app.debug = config['server']['debug']
    app.run(host=config['server']['host'], port=config['server']['port'])
