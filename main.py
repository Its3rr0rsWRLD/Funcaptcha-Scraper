from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Path to your Chrome user data directory
chrome_profile_path = 'C:/Users/YOUR USERNAME HERE/AppData/Local/Google/Chrome/User Data'

def create_driver():
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--user-data-dir=" + chrome_profile_path)
    chrome_options.add_argument("--profile-directory=Default")  # Adjust if you use a different profile
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--ignore-certificate-errors")

    # Path to the chromedriver executable
    chromedriver_path = 'chromedriver.exe'

    service = Service(chromedriver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def main():
    retry_attempts = 3
    retry_delay = 5  # seconds

    while True:
        driver = create_driver()

        try:
            # Open Roblox website
            driver.get('https://www.roblox.com/login')

            # Perform login
            driver.find_element(By.XPATH, '//*[@id="login-username"]').send_keys('sdasdasdsa')
            driver.find_element(By.XPATH, '//*[@id="login-password"]').send_keys('sdasdasdsa')
            driver.find_element(By.XPATH, '//*[@id="login-button"]').click()

            loops = 0

            # Continuously check for the "Reload Challenge" button and window status
            while True:
                try:
                    if loops >= 30:
                        break

                    loops += 1

                    if "Reload Challenge" in driver.page_source:
                        driver.quit()
                    
                    # Check if the window is closed
                    if "An unknown error occurred. Please try again." in driver.page_source:
                        print("An unknown error occurred. Try changing your IP address and restarting the browser.")
                        break

                    if driver.get_window_position() == -1:
                        print("Window closed. Restarting browser...")
                        break
                except Exception as e:
                    if "Reload Challenge" in driver.page_source:
                        driver.quit()
                    print(f"Error occurred: {e}")
                    pass

                time.sleep(1)

        except Exception as e:
            print(f"Error occurred: {e}")
            retry_attempts -= 1
            if retry_attempts <= 0:
                print("Max retry attempts reached. Exiting.")
                break
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)

        finally:
            # Close the browser
            driver.quit()

        # Wait for 2 seconds before restarting the browser
        time.sleep(2)

if __name__ == "__main__":
    main()
