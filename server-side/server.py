from flask import Flask, request, jsonify
import database_helper
import json

app = Flask(__name__)

app.debug = True

@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()

@app.route('/users/sign_up', methods = ['PUT'])
def sign_up():
    data = request.get_json()
    if 'email' in data and 'password' in data and 'firstname' in data and 'familyname' in data and 'gender' in data and 'city' in data and 'country' in data:
        if len(data['email']) <= 100 and len(data['password']) >= 5:
            result = database_helper.sign_up(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country'])
            if result == True:
                return json.dumps({"success": "true", "message" : "User saved!"}), 200
            else:
                return json.dumps({"success": "false", "message" : "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400

@app.route('/users/sign_out/<token>', methods = ['GET'])
def sign_out(token = None):
    if token is not None:
        result = database_helper.sign_out(token)
        if result == True:
            return json.dumps({"success": "true", "message": "Token deleted!"}), 200
        else:
            return json.dumps({"success": "false", "message" : "Something went wrong!"}), 500
    else:
        return '', 400

@app.route('/users/get_user_data_by_email/<email>,<token>', methods = ['GET'])
def get_user_data_by_email(email = None, token = None):
    if email is not None and token is not None:
        result = database_helper.get_user_data_by_email(email,token)
        if result == False or result == None:
            return json.dumps({"success": "false", "message" : "Something went wrong!"}), 500
        else:
            return json.dumps({"success": "true", "message" : "Requested user found!", "data": result}), 200
            #return jsonify(result)

@app.route('/users/get_user_messages_by_email/<email>,<token>', methods = ['GET'])
def get_user_messages_by_email(email = None, token = None):
    if email is not None and token is not None:
        result = database_helper.get_user_messages_by_email(email,token)
        if result == False or result == None:
            return json.dumps({"success": "true", "message" : "Something went wrong!"}), 500
        else:
            return json.dumps({"success": "true", "message" : "Requested wall found!", "data": result}), 200

@app.route('/users/post_message', methods = ['PUT'])
def post_message():
    data = request.get_json()
    if 'token' in data and 'content' in data and 'email' in data:
        if len(data['email']) <= 100:
            result = database_helper.post_message(data['email'], data['content'], data['token'])
            if result == True:
                return json.dumps({"success": "true", "message" : "Message posted to the wall!"}), 200
            else:
                return json.dumps({"success": "false", "message" : "Something went wrong!"}), 500
        else:
            return '', 400
    else:
        return '', 400

if __name__ == '__main__':
    app.run()