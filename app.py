from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/master")
def master():
    return render_template("master.html")
    
@app.route("/player")
def player():
    return render_template("player.html")
    
@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("push", namespace='/master')
def handle_socket_push(data):
    emit("push", data, broadcast=True, namespace="/player")

@socketio.on("start", namespace='/master')
def handle_socket_start():
    emit("start", broadcast=True, namespace="/player")

@socketio.on("stop", namespace='/master')
def handle_socket_stop():
    emit("stop", broadcast=True, namespace="/player")

@socketio.on("restart", namespace='/master')
def handle_socket_restart():
    emit("restart", broadcast=True, namespace="/player")

if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)