import sqlite3
from flask import g

DATABASE_URI = 'database.db'


def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = sqlite3.connect(DATABASE_URI)
    return db


def disconnect_db():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
        g.db = None




def upload_file(filename, email, email_wall):
    try:
        get_db().execute("insert into wall values(?,?,?);", [email_wall, email, filename])
        get_db().commit()
        return True
    except:
        return False

def upload_profile(filename, email):
    try:
        get_db().execute("delete from prof_pics where email like ?;", [email])
        get_db().execute("insert into prof_pics values(?,?);", [email, filename])
        get_db().commit()
        return True
    except:
        return False

def load_profile_picture(email):
    try:
        cursor = get_db().execute('select * from prof_pics where email like ?', [email])
        rows = cursor.fetchall()
        cursor.close()
        if len(rows)>0:
            result = rows[0][1]
            return result
        else:
            return False
    except:
        return False


def find_user(email):
    cursor = get_db().execute('select * from users where email like ?', [email])
    rows = cursor.fetchall()
    cursor.close()
    if len(rows)>0:
        result = []
        for index in range(len(rows)):
            result.append({'email': rows[index][0], 'password': rows[index][1],
                           'firstname': rows[index][2], 'familyname': rows[index][3],
                           'gender': rows[index][4], 'city': rows[index][5], 'country': rows[index][6]})
    else:
        result = False
    return result


def sign_in(token, email):
    try:
        get_db().execute("delete from loggedinusers where email like ?;", [email])
        get_db().execute("insert into loggedinusers values(?,?);", [email, token])
        get_db().commit()
        return True
    except:
        return False

def check_old_password(email,password):
    try:
        cursor = get_db().execute('select * from users where email = ?  AND password = ?;',[email,password])
        rows = cursor.fetchall()
        cursor.close()
        result = []
        if len(rows)>0:
            return True
    except:
        return False

def delete_loggedinuser(email):
    try:
        email=email.replace('"', '')
        result = get_db().execute("delete from loggedinusers where email like ?", [email])
        get_db().commit()
        return True
    except:
        return False

def sign_up(email, password, firstname, familyname, gender, city, country):
    try:
        get_db().execute("insert into users values(?,?,?,?,?,?,?);",
                         [email, password, firstname, familyname, gender, city, country])
        get_db().commit()
        return True
    except:
        return False


def sign_out(token):
    try:
        get_db().execute('delete from loggedinusers where token like ?', [token])
        get_db().commit()
        return True
    except:
        return False


def change_password(token, oldpassword, newpassword):
    try:
        newpassword = newpassword.decode("utf-8")
    except:
        pass
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    if token_exists[0][0] > 0:
        user_email = get_db().execute('select email from loggedinusers where token like ?', [token]).fetchall()[0][0]
        oldpassword_db = get_db().execute('select password from users where email like ?', [user_email]).fetchall()[0][0]
        try:
            oldpassword_db = oldpassword_db.decode("utf-8")
        except:
            pass
        if oldpassword == oldpassword_db:
            try:
                get_db().execute('update users '
                                 'set password = ? '
                                 'where email in '
                                 '(select email '
                                 'from users '
                                 'where email like ? and password like ?);', [newpassword, user_email, oldpassword])
                get_db().commit()
                return True
            except:
                return False
        else:
            return False
    else:
        return False


def get_user_data_by_token(token):
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    if token_exists[0][0] > 0:
        user_email = get_db().execute('select email from loggedinusers where token like ?', [token]).fetchall()[0][0]
        cursor = get_db().execute('select * from users where email like ?', [user_email])
        rows = cursor.fetchall()
        cursor.close()
        result = []
        for index in range(len(rows)):
            result.append({'email': rows[index][0], 'firstname': rows[index][2],
                           'familyname': rows[index][3], 'gender': rows[index][4],
                           'city': rows[index][5], 'country': rows[index][6]})
        return result
    else:
        return False


def get_user_data_by_email(email, token):
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    if token_exists[0][0] > 0:
        cursor = get_db().execute('select * from users where email like ?', [email])
        rows = cursor.fetchall()
        cursor.close()
        result = []
        if len(rows) != 0:
            for index in range(len(rows)):
                result.append({'email': rows[index][0], 'firstname': rows[index][2],
                               'familyname': rows[index][3], 'gender': rows[index][4],
                               'city': rows[index][5], 'country': rows[index][6]})
            return result
        else:
            return False
    else:
        return False


def get_user_messages_by_token(token):
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    if token_exists[0][0] > 0:
        user_email = get_db().execute('select email from loggedinusers where token like ?', [token]).fetchall()[0][0]
        cursor = get_db().execute('select * from wall where email like ?', [user_email])
        rows = cursor.fetchall()
        cursor.close()
        result = []
        if len(rows) != 0:
            for index in range(len(rows)):
                result.append({'email': rows[index][0], 'writer': rows[index][1], 'content': rows[index][2]})
            return result
        else:
            return False
    else:
        return False


def get_user_messages_by_email(email, token):
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    if token_exists[0][0] > 0:
        cursor = get_db().execute('select * from wall where email like ?', [email])
        rows = cursor.fetchall()
        cursor.close()
        result = []
        if len(rows) != 0:
            for index in range(len(rows)):
                result.append({'email': rows[index][0], 'writer': rows[index][1], 'content': rows[index][2]})
            return result
        else:
            return False
    else:
        return False


def post_message(email, content, token):
    token_exists = get_db().execute('select count(*) from loggedinusers where token like ?', [token]).fetchall()
    email_exists = get_db().execute('select count(*) from users where email like ?', [email]).fetchall()
    if token_exists[0][0] > 0 and email_exists[0][0] > 0:
        writer = get_db().execute('select email from loggedinusers where token like ?', [token]).fetchall()[0][0]
        try:
            get_db().execute("insert into wall values(?,?,?);", [email, writer, content])
            get_db().commit()
            return True
        except:
            return False
    else:
        return False
