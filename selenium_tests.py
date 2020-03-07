# Module for Selenium tests

import time
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

if sys.argv[1] == "Chrome":
    driver = webdriver.Chrome("drivers/chromedriver.exe")
else:
    driver = webdriver.Firefox("drivers/geckodriver.exe")

driver.get("http://127.0.0.1:5000/")


def run_tests():
    if len(sys.argv[1:]) >= 1:
        email = "testuser234245@gmail.com"
        password = repeat_password = "aaaaa"
        message1 = "This is an automated message from Selenium (Home Tab)"
        message2 = "This is an automated message from Selenium (Browse Tab)"
        new_password = "12345"
        test_sign_up(email, password, repeat_password, "Test", "User", "Male", "Linkoping", "Sweden")
        test_sign_in(email, password)
        test_post_message(message1)
        driver.find_element_by_name("browse").send_keys(Keys.RETURN)
        test_search_user(email)
        test_post_message_to_others(message2)
        driver.find_element_by_name("account").send_keys(Keys.RETURN)
        test_change_password(oldpassword=password, newpassword=new_password, repeat_newpassword=new_password)
        test_logout()
        driver.close()
    else:
        print("Please specify the browser you would like to run the tests! (Chrome or Firefox)")
        sys.exit(1)


def test_sign_in(email, password):
    email_field = driver.find_element_by_name("signin_username")
    password_field = driver.find_element_by_name("signin_password")
    login_button = driver.find_element_by_name("login_button")

    email_field.send_keys(email)
    time.sleep(1)
    password_field.send_keys(password)
    time.sleep(1)

    login_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_sign_up(email, password, repeat_password, firstname, familyname, gender, city, country):
    email_field = driver.find_element_by_name("signup_username")
    password_field = driver.find_element_by_name("signup_password")
    repeat_password_field = driver.find_element_by_name("rep_password")
    firstname_field = driver.find_element_by_name("firstname")
    familyname_field = driver.find_element_by_name("lastname")
    gender_field = driver.find_element_by_name("gender")
    city_field = driver.find_element_by_name("city")
    country_field = driver.find_element_by_name("country")
    signup_button = driver.find_element_by_name("signup_button")

    email_field.send_keys(email)
    time.sleep(1)
    password_field.send_keys(password)
    time.sleep(1)
    repeat_password_field.send_keys(repeat_password)
    time.sleep(1)
    firstname_field.send_keys(firstname)
    time.sleep(1)
    familyname_field.send_keys(familyname)
    time.sleep(1)
    gender_field.send_keys(gender)
    time.sleep(1)
    city_field.send_keys(city)
    time.sleep(1)
    country_field.send_keys(country)
    time.sleep(1)

    signup_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_post_message(message):
    post_message_filed = driver.find_element_by_name("post_text")
    post_button = driver.find_element_by_name("post_button")

    post_message_filed.send_keys(message)
    time.sleep(1)

    post_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_search_user(email):
    email_filed = driver.find_element_by_name("search_email")
    search_button = driver.find_element_by_name("button_search")

    email_filed.send_keys(email)
    time.sleep(1)

    search_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_post_message_to_others(message):
    post_message_filed = driver.find_element_by_name("post_text_others")
    post_button = driver.find_element_by_name("post_button_others")

    post_message_filed.send_keys(message)
    time.sleep(1)

    post_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_change_password(oldpassword, newpassword, repeat_newpassword):
    oldpassword_filed = driver.find_element_by_name("old_password")
    newpassword_field = driver.find_element_by_name("new_password")
    repeat_newpassword_field = driver.find_element_by_name("rep_new_password")
    change_password_button = driver.find_element_by_name("button_change")

    oldpassword_filed.send_keys(oldpassword)
    time.sleep(1)
    newpassword_field.send_keys(newpassword)
    time.sleep(1)
    repeat_newpassword_field.send_keys(repeat_newpassword)
    time.sleep(1)

    change_password_button.send_keys(Keys.RETURN)
    time.sleep(1)


def test_logout():
    logout_button = driver.find_element_by_id("buttonSignOut")
    logout_button.send_keys(Keys.RETURN)
    time.sleep(3)


if __name__ == '__main__':
    run_tests()
