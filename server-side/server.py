from flask import Flask, request, jsonify
import database_helper
import json
import random
import string

app = Flask(__name__)

app.debug = True


def token_gen(n):
    letters = string.ascii_letters + "0123456789"
    return ''.join(random.choice(letters) for i in range(n))


@app.route('/find_user/<email>', methods=['GET'])
def find_user(email=None):
    if email is not None:
        result = database_helper.find_user(email)
        return jsonify(result)


@app.route('/users/sign_in', methods=['PUT'])
def sign_in():
    data = request.get_json()
    if 'email' in data and 'password' in data:
        user = find_user(data['email']).get_json()[0]
        if user['email'] != None and user['password'] == data['password']:
            token = token_gen(35)
        else:
            return '', 400
        result = database_helper.sign_in(token, user['email'])
        if result:
            return json.dumps({"success": True, "message": "Successfully signed in.", "data": token}), 200
        else:
            return json.dumps({"success": False, "message": "Something went wrong!"}), 500
    else:
        return '', 400


@app.route('/users/sign_up', methods=['PUT'])
def sign_up():
    data = request.get_json()
    if 'email' in data and 'password' in data and 'firstname' in data and 'familyname' in data \
            and 'gender' in data and 'city' in data and 'country' in data:
        if len(data['email']) <= 30 and 5 <= len(data['password']) <= 30 \
                and len(data['fistname']) <= 30 and len(data['familyname']) <= 30 and len(data['gender']) <= 30 \
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


@app.route('/users/sign_out/<token>', methods=['GET'])
def sign_out(token=None):
    if token is not None:
        result = database_helper.sign_out(token)
        if result:
            return json.dumps({"success": "true", "message": "Token deleted!"}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
    else:
        return '', 400


@app.route('/users/change_password', methods=['PUT'])
def change_password():
    data = request.get_json()
    if 'token' in data and 'oldpassword' in data and 'newpassword' in data:
        if 5 <= len(data['newpassword']) <= 30:
            result = database_helper.change_password(data['token'], data['oldpassword'], data['newpassword'])
            if result:
                return json.dumps({"success": "true", "message": "Password changed!"}), 200
            else:
                return json.dumps({"success": "false", "message": "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400


@app.route('/users/get_user_data_by_token/<token>', methods=['GET'])
def get_user_data_by_token(token=None):
    if token is not None:
        result = database_helper.get_user_data_by_token(token)
        if result:
            return json.dumps({"success": "true", "message": "Requested user found!", "data": result}), 200

        else:
            return json.dumps({"success": "true", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_data_by_email/<email>,<token>', methods=['GET'])
def get_user_data_by_email(email=None, token=None):
    if email is not None and token is not None:
        result = database_helper.get_user_data_by_email(email, token)
        if result:
            return json.dumps({"success": "true", "message": "Requested user found!", "data": result}), 200
        else:
            return json.dumps({"success": "false", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_messages_by_token/<token>', methods=['GET'])
def get_user_messages_by_token(token=None):
    if token is not None:
        result = database_helper.get_user_messages_by_token(token)
        if result:
            return json.dumps({"success": "true", "message": "Requested wall found!", "data": result}), 200
        else:
            return json.dumps({"success": "true", "message": "Something went wrong!"}), 500


@app.route('/users/get_user_messages_by_email/<email>,<token>', methods=['GET'])
def get_user_messages_by_email(email=None, token=None):
    if email is not None and token is not None:
        result = database_helper.get_user_messages_by_email(email, token)
        if result:
            return json.dumps({"success": "true", "message": "Requested wall found!", "data": result}), 200
        else:
            return json.dumps({"success": "true", "message": "Something went wrong!"}), 500


@app.route('/users/post_message', methods=['PUT'])
def post_message():
    data = request.get_json()
    if 'token' in data and 'content' in data and 'email' in data:
        if len(data['email']) <= 100:
            result = database_helper.post_message(data['email'], data['content'], data['token'])
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
