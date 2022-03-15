from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit, join_room, close_room
import os

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app, logger=True)
socketio.init_app(app, cors_allowed_origins="*")

# dictionary pairing room name to admin socket id
rooms = {}

@app.route('/')
def index():
    return render_template('landing.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/<room>')
def game(room):
    return render_template('play.html')

def is_admin(id, room):
    return rooms[room] == id

@socketio.on('connection')
def on_connect(socket):
    print('user connected')

@socketio.on('disconnect')
def on_admin_disconnect():
    print('user disconnected')
    # so to not change the size of dictionary during iteration
    room_to_del = None
    for room in rooms:
        if is_admin(request.sid, room):
            room_to_del = room
            close_room(room)
    if room_to_del:
        del rooms[room_to_del]

@socketio.on('exists')
def exists(data):
    room = data['room']
    emit('exists', room in rooms, callback=ack)

@socketio.on('taken')
def on_taken(data):
    room = data['room']
    name = data['name']
    emit('taken', { 'name': name }, room=room)

@socketio.on('join')
def on_join(data):
    name = data['name']
    room = data['room']
    join_room(room)
    emit('join', data, room=room)
    print(f'{name} joined {room}')

@socketio.on('begin')
def on_begin(data):
    room = data['room']
    rand = data['rand']
    if is_admin(request.sid, room):
        emit('begin', rand, room=room)

@socketio.on('daily')
def on_daily(data):
    room = data['room']
    if is_admin(request.sid, room):
        emit('daily', room=room)

@socketio.on('resume')
def on_resume(data):
    room = data['room']
    idx = data['idx']
    order = data['order']
    emit('resume', { 'order': order, 'idx': idx }, room=room)

def ack():
    print('message was received!')

@socketio.on('create')
def on_create(data):
    room = data['room']
    if (room in rooms or len(room) < 3):
        emit('create', False)
        print(f'cannot create room: {room}')
    else:
        join_room(room)
        rooms[room] = request.sid
        emit('create', True, callback=ack)
        print(f'created room: {room}')

@socketio.on('player_list')
def on_player_list(data):
    room = data['room']
    player_list = data['player_list']
    emit('player_list', player_list, room=room)

@socketio.on('empty')
def on_empty(room):
    if is_admin(request.sid, room):
        emit('empty', room=room)

@socketio.on('full')
def on_full(room):
    if is_admin(request.sid, room):
        emit('full', room=room)

@socketio.on('write_letter')
def on_write_letter(data):
    room = data['room']
    emit('write_letter', data, room=room)

@socketio.on('overwrite_letter')
def on_overwrite_letter(data):
    room = data['room']
    emit('overwrite_letter', data, room=room)

# handled by on_resume
# @socketio.on('confirm_letter')
# def on_confirm_letter():
#     pass

@socketio.on('delete_letter')
def on_delete_letter(data):
    room = data['room']
    order = data['order']
    emit('delete_letter', order, room=room)

@socketio.on('submit_guess')
def on_submit_guess(data):
    room = data['room']
    order = data['order']
    idx = data['idx']
    emit('submit_guess', { 'order': order, 'idx': idx }, room=room)

@socketio.on('end')
def on_end(room):
    if is_admin(request.sid, room):
        emit('end')

@socketio.on('restart')
def on_restart(data):
    room = data['room']
    rand = data['rand']
    if is_admin(request.sid, room):
        emit('restart', rand, room=room)

@socketio.on('timer')
def on_timer(data):
    room = data['room']
    time = data['time']
    if is_admin(request.sid, room):
        emit('timer', time, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')