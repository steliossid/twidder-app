from flask import Flask, request, jsonify, send_from_directory
import database_helper
import json
import random
import string

app = Flask(__name__)

app.debug = True

@app.route('/')
def root():
    return send_from_directory('static', 'client.html')


def token_gen(n):
    letters = string.ascii_letters + "0123456789"
    return ''.join(random.choice(letters) for i in range(n))


@app.route('/find_user/<email>', methods=['GET'])
def find_user(email=None):
    if email is not None:
        result = database_helper.find_user(email)
        return jsonify(result)


@app.route('/users/sign_in/', methods=['POST'])
def sign_in():
    data = request.get_json()
    if 'email' in data and 'password' in data:
        user = find_user(data['email']).get_json()[0]
        if user['email'] is not None and user['password'] == data['password']:
            token = token_gen(35)
        else:
            return '', 400
        result = database_helper.sign_in(token, user['email'])
        if result:
            return json.dumps({"success": "true", "message": "Successfully signed in.", "data": token}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
    else:
        return '', 400

@app.route('/users/check_old_password/<email>,<password>', methods=['GET'])
def check_old_password(email=None,password=None):
    if email and password:
        result = database_helper.check_old_password(email,password)
        if result:
            return json.dumps({"success": "true", "message": "Password matching!"}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
    else:
        return '', 400

@app.route('/users/check_if_user_signed_in/', methods=['GET'])
def check_if_user_signed_in():
    result = database_helper.check_if_user_signed_in()
    if result:
        return json.dumps({"success": "true", "message": "User is logged in!"}), 200
    else:
        return json.dumps({"success": "false", "message": "Something went wrong!"}), 500

@app.route('/users/get_logged_in_data/', methods=['GET'])
def get_logged_in_data():
    result = database_helper.get_logged_in_data()
    if result:
        return json.dumps({"success": "true", "message": "User's data!", "data": result}), 200
    else:
        return json.dumps({"success": "false", "message": "Something went wrong!"}), 500

@app.route('/users/sign_up/', methods=['POST'])
def sign_up():
    data = request.get_json()
    if 'email' in data and 'password' in data and 'firstname' in data and 'familyname' in data \
            and 'gender' in data and 'city' in data and 'country' in data:
        if len(data['email']) <= 30 and 5 <= len(data['password']) <= 30 \
                and len(data['firstname']) <= 30 and len(data['familyname']) <= 30 and len(data['gender']) <= 30 \
                and len(data['city']) <= 30 and len(data['country']) <= 30:
            result = database_helper.sign_up(data['email'], data['password'], data['firstname'], data['familyname'],
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
            result = database_helper.change_password(token, data['oldpassword'], data['newpassword'])
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


@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()


if __name__ == '__main__':
    app.run()
