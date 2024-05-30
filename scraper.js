(function() {
    'use strict';

    console.log("Tampermonkey script running.");

    const processedUrls = new Set();  // Set to store URLs that have already been processed
    const openedWindows = [];         // Array to store references to opened windows

    // Generate a random 8-digit number
    function getRandomFilename() {
        return Math.floor(10000000 + Math.random() * 90000000).toString(); // Generates a random 8-digit number
    }

    // Function to search for blob URLs in all element attributes and open/download them
    function searchForBlobUrls() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            Array.from(element.attributes).forEach(attr => {
                if (attr.value.includes('blob:https://roblox-api.arkoselabs.com/')) {
                    const match = attr.value.match(/blob:https:\/\/roblox-api\.arkoselabs\.com\/[\w-]+/);
                    if (match && !processedUrls.has(match[0])) {
                        console.log('Found blob URL:', match[0]);
                        processedUrls.add(match[0]);  // Add to the set of processed URLs
                        const randomFilename = getRandomFilename() + '.png'; // Assumes the content is an image
                        const newWindow = window.open(match[0], '_blank'); // Opens URL in a new tab
                        openedWindows.push(newWindow); // Store the window reference
                        downloadBlob(match[0], randomFilename);
                    }
                }
            });
        });
    }

    // Function to create a download link and trigger the download
    function downloadBlob(blobUrl, filename) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        closeOpenedWindows(); // Close all opened blob windows after downloading
    }

    // Function to close all opened windows
    function closeOpenedWindows() {
        openedWindows.forEach(win => {
            if (win && !win.closed) {
                win.close(); // Close the window
            }
        });
        openedWindows.length = 0; // Clear the array after closing windows
    }

    // Function to find and click specified buttons continuously
    function continuouslyClickButtons() {
        const buttonSelectors = [
            { text: 'Submit', selector: 'button' },
            { text: 'Try again', selector: 'button' },
            { text: 'Start Puzzle', selector: 'button' },
            { text: 'Reload Challenge', selector: '.sc-nkuzb1-0.yuVdl.button' }
        ];

        buttonSelectors.forEach(btn => {
            const buttons = document.querySelectorAll(btn.selector);
            buttons.forEach(button => {
                if (button.innerText.trim() === btn.text) {
                    console.log(`Checking button: ${button.innerText.trim()}`);
                    
                    if (button.innerText.trim() === "Reload Challenge") {
                        console.log('Found Reload Challenge button.');

                        // Find and click the close button with the span id 'icon-close'
                        const closeButton = document.querySelector('.challenge-captcha-close-button');
                        const closeIcon = closeButton ? closeButton.querySelector('#icon-close') : null;
                        
                        if (closeButton && closeIcon) {
                            console.log('Clicking the close button.');
                            closeButton.click();
                        } else {
                            console.log('Close button or icon-close not found.');
                        }

                        // Wait for 2 seconds before clicking the login button
                        setTimeout(() => {
                            const loginButton = document.querySelector('.btn-full-width.login-button.btn-secondary-md');
                            if (loginButton) {
                                console.log('Clicking the login button after waiting.');
                                loginButton.click();  // Click the login button
                            } else {
                                console.log('Login button not found.');
                            }
                        }, 2000);  // 2000 milliseconds = 2 seconds

                        return;  // Exit the function after processing the button
                    }

                    if (button.innerText.includes(btn.text) && button.innerText.trim() !== "Reload Challenge") {
                        button.click();
                        console.log(`${btn.text} button clicked.`);
                    }
                }
            });
        });
    }

    // Periodically search for blob URLs and check buttons
    setInterval(() => {
        searchForBlobUrls();
        continuouslyClickButtons();
    }, 1000); // Checks every second
})();