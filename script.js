// Open the popup
function contactOpenPopup() {
    document.getElementById('contactpopup').style.display = 'flex';
}

// Handle form submission (store the redirection URL in sessionStorage)
function contactHandleSubmit(event) {
    // Prevent the form from submitting normally

    // Store the initial redirection URL in sessionStorage
   

    // Show the thank you message
    document.getElementById('contactThankYouMessage').style.display = 'block';

    // Simulate form submission after a delay (to show the "Thank you" message)
    setTimeout(function() {
        document.getElementById('contactForm').submit();
    }, 2000); // Delay for showing the thank you message before submission
}

// Handle form submission and redirection override


// Close popup
function contactClosePopup() {
    document.getElementById('contactpopup').style.display = 'none';
}


// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Initialize the Flatpickr calendar on the hidden input with minDate set to today's date
flatpickr("#appointmentDate", {
  minDate: today, // Prevent selecting past dates
  onChange: function(selectedDates, dateStr, instance) {
    // Update the hidden input field with the selected date
    let appointmentDateField = document.getElementById('appointmentDateField');
    appointmentDateField.value = dateStr;

    // Update the email content in the textarea with the selected appointment date
    let emailBody = document.getElementById('emailBody');
    emailBody.value = "You have an appointment scheduled on " + dateStr + ".";
  }
});

// Show the calendar when the button is clicked
document.getElementById('datePickerButton').addEventListener('click', function() {
  document.getElementById('appointmentDate').click();
});

// Open the popup
function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

// Handle form submission
function handleSubmit(event) {
    // Prevent the default form submission behavior

    // Show the thank you message
    document.getElementById('thankYouMessage').style.display = 'block';

    // Simulate a short delay for showing the thank you message
    setTimeout(function() {
        // Now submit the form manually
        document.getElementById('emailForm').submit(); // Trigger form submission

        // Close the popup after a short delay (to show the thank you message)
        closePopup();
    }, 3000); // Delay for 3 seconds (you can adjust the time)
}

// Close popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


function getTextContentBySelector(selector) {
    const element = document.querySelector(selector);
    if (element) {
        return element.textContent.trim();
    } else {
        console.warn(`Element with selector ${selector} not found.`);
        return ''; // Return an empty string if the element doesn't exist
    }
}

// Function to fetch translations using Google Translate API
async function fetchTranslations(textArray, targetLang) {
    const apiKey = "AIzaSyDyAuH0KPgIbN_E4ahb36tp1YNpcK_kQWM"; // Replace with your actual API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: textArray, target: targetLang }),
    });

    const data = await response.json();
    if (data.error) {
        console.error("Error translating:", data.error);
        return [];
    }

    return data.data.translations.map(t => t.translatedText);
}

// Function to translate page content based on selected language
async function translateContent() {
    const selectedLang = document.getElementById("languageSelect").value;

    // Collect text elements to translate by their selectors
    const textElements = [
        { selector: "#home h1", text: getTextContentBySelector("#home h1") },
        { selector: "#home p", text: getTextContentBySelector("#home p") },
        { selector: "#home a", text: getTextContentBySelector("#home a") },
        { selector: "#nav-item-home", text: "Home" },
        { selector: "#nav-item-about", text: "About us" },
        { selector: "#nav-item-products", text: "Products" },
        { selector: "#nav-item-gallery", text: "Gallery" },
        { selector: "#nav-item-payment", text: "Payment" },
        { selector: "#nav-item-contact", text: "Contact us" },
        { selector: "#nav-item-schedule", text: "Schedule" },
        { selector: "#about h2", text: getTextContentBySelector("#about h2") },
        { selector: "#about p", text: getTextContentBySelector("#about p") },
        { selector: "#products h2", text: getTextContentBySelector("#products h2") },
        { selector: "#gallery h2", text: getTextContentBySelector("#gallery h2") },
        { selector: "#payments h2", text: getTextContentBySelector("#payments h2") },
        { selector: "#payments p", text: getTextContentBySelector("#payments p") },
        { selector: "#payments .instructions h3", text: getTextContentBySelector("#payments .instructions h3") },
        { selector: "#payments .instructions li:nth-child(1)", text: getTextContentBySelector("#payments .instructions li:nth-child(1)") },
        { selector: "#payments .instructions li:nth-child(2)", text: getTextContentBySelector("#payments .instructions li:nth-child(2)") },
        { selector: "#payments .instructions li:nth-child(3)", text: getTextContentBySelector("#payments .instructions li:nth-child(3)") },
        { selector: "#payments .instructions li:nth-child(4)", text: getTextContentBySelector("#payments .instructions li:nth-child(4)") },
        { selector: "#payments .instructions p", text: getTextContentBySelector("#payments .instructions p") },
        { selector: "#contact h2", text: getTextContentBySelector("#contact h2") },
        { selector: "#contact p", text: getTextContentBySelector("#contact p") },
        { selector: "#contact .contact-details h3", text: getTextContentBySelector("#contact .contact-details h3") },
        { selector: "#contact .contact-details a", text: getTextContentBySelector("#contact .contact-details a") }
    ];

    // Collect all product descriptions
    const productDescriptions = Array.from(document.querySelectorAll('.service-card p'))
        .map(element => element.textContent);

    // Add product descriptions to textElements
    productDescriptions.forEach((description, index) => {
        textElements.push({
            selector: `.service-card:nth-child(${index + 1}) p`,
            text: description
        });
    });

    const contactDetailsIds = [
        "#contact-name",
        "#contact-address",
        "#contact-days",
        "#contact-hours"
    ];

    // Fetch the current text content from the HTML elements for address and hours only
    const contactText = contactDetailsIds.map(id => {
        const element = document.querySelector(id);
        return element ? element.textContent.trim() : ''; // Safely fetch text content
    });

    // Translate the contact details (address and hours)
    const translatedContactText = await fetchTranslations(contactText, selectedLang);

    // Update the contact address and hours with the translated text
    contactDetailsIds.forEach((id, index) => {
        const el = document.querySelector(id);
        if (el) {
            el.textContent = translatedContactText[index] || el.textContent; // Update with translated text or keep the original
        }
    });
    

    // Collect all navigation items text for translation (no need for IDs)
    const navItems = Array.from(document.querySelectorAll('.nav-link'))
        .map(nav => nav.textContent);

    // Add nav items text to translation
    navItems.forEach(navItem => {
        textElements.push({
            text: navItem
        });
    });

    const textsToTranslate = textElements.map(element => element.text);
    const translatedTexts = await fetchTranslations(textsToTranslate, selectedLang);

    // Update each text element with its translated content
    let translatedIndex = 0;

    // Update text elements (those that have selectors)
    textElements.forEach((element) => {
        if (element.selector) {
            const el = document.querySelector(element.selector);
            if (el) {
                el.textContent = translatedTexts[translatedIndex] || element.text;
                translatedIndex++;
            } else {
                console.warn(`Element with selector ${element.selector} not found.`);
            }
        } else {
            // Update nav items (no selectors)
            const navLinks = document.querySelectorAll('.nav-link');
            if (navLinks[translatedIndex]) {
                navLinks[translatedIndex].textContent = translatedTexts[translatedIndex] || element.text;
            }
            translatedIndex++;
        }
    });
}

// Listen to language selection change
document.getElementById("languageSelect").addEventListener("change", translateContent);

// Set the current year in the footer dynamically
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Function to set the initial content based on the language
async function setInitialContent() {
    const selectedLang = document.getElementById("languageSelect").value;
    translateContent(selectedLang); // Translate the page content initially when the page loads.
}

// Run initial translation when the page is loaded
window.onload = setInitialContent;


