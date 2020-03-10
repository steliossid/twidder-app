# Module for Selenium tests

import time
import server
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class TwidderTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome("drivers/chromedriver.exe")

    def test_sign_up(self):
        driver = self.driver
        email = server.token_generator(10) + "@gmail.com"
        password = repeat_password = "password"
        firstname = "Test"
        familyname = "User"
        gender = "Male"
        city = "Linkoping"
        country = "Sweden"
        driver.get("https://twidder-app-tddd97.herokuapp.com/")

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
        password_field.send_keys(password)
        repeat_password_field.send_keys(repeat_password)
        firstname_field.send_keys(firstname)
        familyname_field.send_keys(familyname)
        gender_field.send_keys(gender)
        city_field.send_keys(city)
        country_field.send_keys(country)

        signup_button.send_keys(Keys.RETURN)
        time.sleep(2)
        signup_message = driver.find_element_by_id("signup_username_message").text
        # print(signup_message)
        assert signup_message == "User saved!"

    def test_sign_in(self):
        driver = self.driver
        email = "test@gmail.com"
        password = "password"
        driver.get("https://twidder-app-tddd97.herokuapp.com/")

        email_field = driver.find_element_by_name("signin_username")
        password_field = driver.find_element_by_name("signin_password")
        login_button = driver.find_element_by_name("login_button")

        email_field.send_keys(email)
        password_field.send_keys(password)

        login_button.send_keys(Keys.RETURN)
        time.sleep(2)
        signin_message = driver.find_element_by_id("right_email").text
        # print(signin_message)

        assert signin_message == email

    def test_post_message(self):
        driver = self.driver
        email = "test@gmail.com"
        password = "password"
        driver.get("https://twidder-app-tddd97.herokuapp.com/")
        email_field = driver.find_element_by_name("signin_username")
        password_field = driver.find_element_by_name("signin_password")
        login_button = driver.find_element_by_name("login_button")
        email_field.send_keys(email)
        password_field.send_keys(password)
        login_button.send_keys(Keys.RETURN)
        time.sleep(2)

        message1 = "This is an automated message from Selenium (Home Tab)"

        post_message_filed = driver.find_element_by_name("post_text")
        post_button = driver.find_element_by_name("post_button")

        post_message_filed.send_keys(message1)
        post_button.send_keys(Keys.RETURN)
        time.sleep(2)
        post_message = driver.find_element_by_id("post_message").text
        # print(post_message)

        assert post_message == "Message posted to the wall!"

    def test_search_user(self):
        driver = self.driver
        email = "test@gmail.com"
        password = "password"
        driver.get("https://twidder-app-tddd97.herokuapp.com/")
        email_field = driver.find_element_by_name("signin_username")
        password_field = driver.find_element_by_name("signin_password")
        login_button = driver.find_element_by_name("login_button")
        email_field.send_keys(email)
        password_field.send_keys(password)
        login_button.send_keys(Keys.RETURN)
        time.sleep(2)

        driver.find_element_by_name("browse").send_keys(Keys.RETURN)
        email_filed = driver.find_element_by_name("search_email")
        search_button = driver.find_element_by_name("button_search")

        email_filed.send_keys(email)

        search_button.send_keys(Keys.RETURN)
        time.sleep(1)
        search_message = driver.find_element_by_id("user_search_message").text
        # print(search_message)

        assert search_message == "Requested user found!"

    def test_post_message_to_others(self):
        driver = self.driver
        email = "test@gmail.com"
        password = "password"
        driver.get("https://twidder-app-tddd97.herokuapp.com/")
        email_field = driver.find_element_by_name("signin_username")
        password_field = driver.find_element_by_name("signin_password")
        login_button = driver.find_element_by_name("login_button")
        email_field.send_keys(email)
        password_field.send_keys(password)
        login_button.send_keys(Keys.RETURN)
        time.sleep(2)

        message2 = "This is an automated message from Selenium (Browse Tab)"

        driver.find_element_by_name("browse").send_keys(Keys.RETURN)
        email_filed = driver.find_element_by_name("search_email")
        search_button = driver.find_element_by_name("button_search")

        email_filed.send_keys(email)

        search_button.send_keys(Keys.RETURN)
        time.sleep(1)

        post_message_filed = driver.find_element_by_name("post_text_others")
        post_button = driver.find_element_by_name("post_button_others")

        post_message_filed.send_keys(message2)

        post_button.send_keys(Keys.RETURN)
        time.sleep(1)
        post_others_message = driver.find_element_by_id("post_message_others").text
        # print(post_others_message)

        assert post_others_message == "Message posted to the wall!"

    def tearDown(self):
        self.driver.close()


if __name__ == '__main__':
    unittest.main()
