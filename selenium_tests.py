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
        email = "testuser5@gmail.com"
        password = repeat_password = "aaaaa"
        test_sign_up(email, password, repeat_password, "Test", "User", "Male", "Linkoping", "Sweden")
        time.sleep(1)
        test_sign_in(email, password)
        time.sleep(1)
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


def test_post_message(message):
    pass


def test_search_user(email):
    pass


def test_post_message_to_others(message):
    pass


def test_change_password():
    pass


def test_logout():
    pass


if __name__ == '__main__':
    run_tests()
