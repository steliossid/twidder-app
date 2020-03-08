from flask import Flask, request, jsonify, send_from_directory
import database_helper
import json
import random
import string
import sys
import os
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask_bcrypt import Bcrypt

sys.path.append(os.path.join(os.path.dirname(__file__)))


app = Flask(__name__)
bcrypt = Bcrypt(app)

app.debug = True


@app.route('/')
def root():
    return send_from_directory('static', 'client.html')


def token_generator(n):
    letters = string.ascii_letters + "0123456789"
    return ''.join(random.choice(letters) for i in range(n))


@app.route('/find_user/<email>', methods=['GET'])
def find_user(email=None):
    if email is not None:
        result = database_helper.find_user(email)
    else:
        result = False
    if not result:
        return False
    else:
        return jsonify(result)


signed_in_users = dict()


@app.route('/users/sign_in/', methods=['POST'])
def sign_in():
    data = request.get_json()
    if data['email'] in signed_in_users:
        msg = {
            'message': 'Logged in from another device'
        }
        try:
            signed_in_users[data['email']].send(json.dumps(msg))
            del signed_in_users[data['email']]
            database_helper.delete_loggedinuser(data['email'])
        except:
            pass
    if 'email' in data and 'password' in data:
        if find_user(data['email']):
            user = find_user(data['email']).get_json()[0]
            if user['email'] is not None and bcrypt.check_password_hash(user['password'], data['password']):
                token = token_generator(35)
            else:
                return '', 400
            result = database_helper.sign_in(token, user['email'])
            if result:
                return json.dumps({"success": "true", "message": "Successfully signed in.", "data": token}), 200
            else:
                return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400


@app.route('/users/check_old_password/<email>,<password>', methods=['GET'])
def check_old_password(email=None, password=None):
    if email and password and find_user(email):
        user_password = find_user(email).get_json()[0]['password']
        if bcrypt.check_password_hash(user_password, password):
            result = database_helper.check_old_password(email, user_password)
            if result:
                return json.dumps({"success": "true", "message": "Password matching!"}), 200
            else:
                return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
    else:
        return '', 400


@app.route('/users/sign_up/', methods=['POST'])
def sign_up():
    data = request.get_json()
    if 'email' in data and 'password' in data and 'firstname' in data and 'familyname' in data \
            and 'gender' in data and 'city' in data and 'country' in data:
        if len(data['email']) <= 30 and 5 <= len(data['password']) <= 30 \
                and len(data['firstname']) <= 30 and len(data['familyname']) <= 30 and len(data['gender']) <= 30 \
                and len(data['city']) <= 30 and len(data['country']) <= 30:
            pw_hashed = bcrypt.generate_password_hash(data['password'])
            result = database_helper.sign_up(data['email'], pw_hashed, data['firstname'], data['familyname'],
                                             data['gender'], data['city'], data['country'])
            if result:
                return json.dumps({"success": "true", "message": "User saved!"}), 200
            else:
                return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400


@app.route('/users/sign_out/', methods=['POST'])
def sign_out():
    token = request.headers.get('Token')
    if token is not None:
        result = database_helper.sign_out(token)
        if result:
            return json.dumps({"success": "true", "message": "Token deleted!"}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
    else:
        return '', 400


@app.route('/users/change_password/', methods=['PUT'])
def change_password():
    token = request.headers.get('Token')
    data = request.get_json()
    if 'oldpassword' in data and 'newpassword' in data:
        if 5 <= len(data['newpassword']) <= 30:
            user_email = database_helper.get_user_data_by_token(token)[0]['email']
            user = find_user(user_email).get_json()[0]
            new_pw_hashed = bcrypt.generate_password_hash(data['newpassword'])
            if bcrypt.check_password_hash(user['password'], data['oldpassword']):
                result = database_helper.change_password(token, user['password'], new_pw_hashed)
                if result:
                    return json.dumps({"success": "true", "message": "Password changed!"}), 200
                else:
                    return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400


@app.route('/users/get_user_data_by_token/', methods=['GET'])
def get_user_data_by_token():
    token = request.headers.get('Token')
    if token is not None:
        result = database_helper.get_user_data_by_token(token)
        if result:
            return json.dumps({"success": "true", "message": "Requested user found!", "data": result[:]}), 200

        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_data_by_email/<email>', methods=['GET'])
def get_user_data_by_email(email=None):
    token = request.headers.get('Token')
    if email is not None and token is not None:
        result = database_helper.get_user_data_by_email(email, token)
        if result:
            return json.dumps({"success": "true", "message": "Requested user found!", "data": result[:]}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_messages_by_token/', methods=['GET'])
def get_user_messages_by_token():
    token = request.headers.get('Token')
    if token is not None:
        result = database_helper.get_user_messages_by_token(token)
        if result:
            return json.dumps({"success": "true", "message": "Requested wall found!", "data": result[:]}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_messages_by_email/<email>', methods=['GET'])
def get_user_messages_by_email(email=None):
    token = request.headers.get('Token')
    if email is not None and token is not None:
        result = database_helper.get_user_messages_by_email(email, token)
        if result:
            return json.dumps({"success": "true", "message": "Requested wall found!", "data": result[:]}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500


@app.route('/users/post_message/', methods=['POST'])
def post_message():
    token = request.headers.get('Token')
    data = request.get_json()
    if token is not None and "content" in data and "email" in data:
        if len(data['email']) <= 30 and len(data['content']) <= 120:
            result = database_helper.post_message(data['email'], data['content'], token)
            if result:
                return json.dumps({"success": "true", "message": "Message posted to the wall!"}), 200
            else:
                return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400


@app.route('/check_websocket')
def check_websocket():
    if request.environ.get('wsgi.websocket'):
        web_socket = request.environ['wsgi.websocket']
        message = json.loads(web_socket.receive())
        user = database_helper.get_user_data_by_token(message['token'])[0]['email']
        signed_in_users[user] = web_socket
        while not web_socket.closed:
            message = web_socket.receive()
            if message is not None:
                message = json.loads(message)
                message = {'message': 'Successfully logged in'}
                web_socket.send(json.dumps(message))
        try:
            del signed_in_users[user]
        except:
            pass
    return 'None'


@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()


if __name__ == '__main__':
	# print("Server: http://127.0.0.1:5000/")
    # http_server = WSGIServer(('127.0.0.1', 5000), app, handler_class=WebSocketHandler)
	http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
	http_server.serve_forever()
    # app.run()
