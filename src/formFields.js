
/*************************************************
 * Utilty Functions
 ************************************************/

/**
 * Creates a field manager function that dynamically generates and inserts HTML fields into the DOM.
 * 
 * This function returns another function that can be used to generate and insert HTML fields dynamically
 * into a specified location within the DOM. The field manager also supports validation and additional 
 * post-processing callbacks.
 * 
 * @param {function} templateGenerator - A function that generates the HTML template for the field. 
 *                                       It receives `id`, `margin`, and `isRequired` as parameters.
 * @param {function} validationCallback - A callback function that applies validation to the generated field.
 *                                         It receives the generated field's `id` as a parameter.
 * @param {function} [afterPostCallback=null] - An optional callback function for additional processing after the 
 *                                              field has been inserted. It receives the `id` and `isRequired` 
 *                                              parameters.
 * @returns {function} - A function that generates and inserts a new field when called with appropriate arguments.
 */
function createFieldManager(templateGenerator, validationCallback, afterPostCallback = null) {
    let idCounter = 0; // Counter to generate unique IDs for each field

    return function(adjacentHTMLId, insertPosition, margin, isRequired = false) {
        const adjacentHTML = document.getElementById(adjacentHTMLId); // Find the element to insert the new field after/before
        const id = ++idCounter; // Increment the ID counter for each new field
        const template = templateGenerator(id, margin, isRequired); // Generate the HTML template for the new field

        // Insert the generated HTML template into the DOM at the specified position
        adjacentHTML.insertAdjacentHTML(insertPosition, template);

        // If a validation callback is provided, apply validation to the new field
        if (validationCallback) {
            validationCallback(id);
        }

        // If an after-post callback is provided, perform additional processing on the new field
        if (afterPostCallback) {
            afterPostCallback(id, isRequired);  // Used to add nested elements or additional setup
        }
    };
}

/*************************************************
 * Phone Field Creation
 ************************************************/

/**
 * Generates a phone number input field with validation and formatting.
 * 
 * This uses the createFieldManager to generate a phone input field, along with an associated 
 * error message element. It also attaches validation and formatting logic to the input field.
 */
const addPhone = createFieldManager(
    (id, margin, isRequired) => `
        <input class="phone" type="tel" id="phone${id}" name="phone" style="margin-top: ${margin}px" placeholder="(555)-555-5555${isRequired ? ' *' : ''}" maxlength="14"${isRequired ? ' required' : ''}>
        <span id="phone-error${id}" class="error-label">Please enter a valid phone number.</span>
    `, 
    attachPhoneValidationEvents
);

/**
 * Attaches validation and formatting logic to the phone input field.
 * 
 * This function adds event listeners to a phone input field to validate the phone number 
 * format and automatically format the input as the user types. It checks if the phone number 
 * is 14 characters long (including formatting) and applies a simple formatting pattern 
 * (e.g., (555)-555-5555).
 * 
 * @param {number} id - The unique identifier for the phone input field.
 */
function attachPhoneValidationEvents(id) {
    const phoneId = `phone${id}`; // Generate the phone input field ID
    const errorId = `phone-error${id}`; // Generate the error message element ID
    const phoneField = document.getElementById(phoneId); // Get the phone input field element
    
    /**
     * Validates the phone number input field.
     * 
     * Checks whether the phone number has exactly 14 characters (formatted length).
     */
    function validate() {
        validateField(phoneId, errorId, phoneField.value.length != 14, "Please enter a valid phone number.");
    };
    
    /**
     * Formats the phone number as the user types.
     * 
     * This function formats the phone number to follow the pattern (555)-555-5555.
     * It removes any non-numeric characters and inserts the appropriate formatting characters.
     * 
     * @param {Event} e - The input event triggered by the user typing in the phone field.
     */
    function formateNumber(e) {
        let input = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
        let formatted = '';

        if (input.length > 0) {
            formatted += '(' + input.substring(0, 3); // Add opening parenthesis and first 3 digits
        }
        if (input.length >= 4) {
            formatted += ')-' + input.substring(3, 6); // Add closing parenthesis and dash, next 3 digits
        }
        if (input.length >= 7) {
            formatted += '-' + input.substring(6, 10); // Add dash and last 4 digits
        }

        e.target.value = formatted; // Update the input field value with the formatted number
    }

    // Attach event listeners for validation and formatting on input and change events
    phoneField.addEventListener('input', validate);
    phoneField.addEventListener('input', formateNumber);
    phoneField.addEventListener('change', validate);
    phoneField.addEventListener('change', formateNumber);
}

/*************************************************
 * Name Field Creation
 ************************************************/

/**
 * Generates a set of input fields for the user's first and last name with validation.
 * 
 * This uses the createFieldManager to generate a pair of input fields for the first name 
 * and last name, along with an associated error message element. It also attaches validation 
 * logic to these input fields to ensure the names are valid.
 */
const addName = createFieldManager(
    (id, margin, isRequired) => `
        <div id="name-fields${id}" class="name-fields">
            <input type="text" id="first-name${id}" name="first-name${id}" style="margin-top: ${margin}px" placeholder="First Name${isRequired ? ' *' : ''}"${isRequired ? ' required' : ''}>
            <input type="text" id="last-name${id}" name="last-name${id}" style="margin-top: ${margin}px" placeholder="Last Name${isRequired ? ' *' : ''}"${isRequired ? ' required' : ''}>
        </div>
        <span id="name-error${id}" class="error-label">Please enter a valid name.</span>
    `, 
    attachNameValidationEvents
);

/**
 * Attaches validation logic to the first and last name input fields.
 * 
 * This function adds event listeners to the first and last name input fields to validate 
 * the names as the user types. It checks that the names are valid based on certain criteria 
 * such as length and allowed characters.
 * 
 * @param {number} id - The unique identifier for the name input fields.
 */
function attachNameValidationEvents(id) {
    const firstNameId = `first-name${id}`; // Generate the first name input field ID
    const lastNameId = `last-name${id}`; // Generate the last name input field ID
    const errorId = `name-error${id}`; // Generate the error message element ID

    const firstName = document.getElementById(firstNameId); // Get the first name input field element
    const lastName = document.getElementById(lastNameId); // Get the last name input field element

    /**
     * Validates both the first name and last name input fields.
     * 
     * This function checks the validity of the first name and last name using the validateName function 
     * and displays an error message if the name is invalid.
     */
    function validate() {
        if (!validateField(firstNameId, errorId, !validateName(firstName.value), "Please enter a valid first name."))
            return;
        validateField(lastNameId, errorId, !validateName(lastName.value), "Please enter a valid last name.");
    }

    // Attach event listeners for validation on input events for both first and last name fields
    firstName.addEventListener('input', validate);
    lastName.addEventListener('input', validate);
}

/**
 * Validates a name based on specific criteria.
 * 
 * This function checks that the name is between 2 and 50 characters long, only contains 
 * allowed characters (letters, accents, hyphens, spaces, apostrophes), and does not contain 
 * any invalid patterns such as double hyphens or double apostrophes.
 * 
 * @param {string} name - The name to validate.
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 */
function validateName(name) {
    if (name.length == 0)
        return true; // Allow empty names (optional fields)
    if (name.length < 2 || name.length > 50)
        return false; // Name must be between 2 and 50 characters long

    const nameRegex = /^[a-zA-Zà-ÿÀ-ß '-]+$/; // Regular expression to allow letters, accents, hyphens, spaces, and apostrophes
    if (!nameRegex.test(name)) 
        return false; // Invalid characters found in the name
    if (/--|''/.test(name)) 
        return false; // Double hyphens or double apostrophes are not allowed
    if (name.trim() !== name || name.includes("  ")) 
        return false; // Name cannot start or end with spaces, and cannot contain double spaces

    return true; // Name is valid
}


/*************************************************
 * Email Field Creation
************************************************/

/**
 * Generates an email input field with validation.
 * 
 * This uses the createFieldManager to generate an email input field, along with an associated 
 * error message element. It also attaches validation logic to the input field to ensure 
 * the email address is valid.
 */
const addEmail = createFieldManager(
    (id, margin, isRequired) => `
        <input id="email${id}" type="email" name="email" placeholder="email@example.com${isRequired ? " *" : ""}" style="margin-top: ${margin}px"${isRequired ? " required" : ""}>
        <span id="email-error${id}" class="error-label">Please enter a valid email address.</span>
    `, 
    attachEmailValidationEvents
);

/**
 * Attaches validation logic to the email input field.
 * 
 * This function adds an event listener to the email input field to validate the email 
 * address as the user types. It checks that the email address matches a standard 
 * format for common domains such as .com, .net, .gov, and .edu.
 * 
 * @param {number} id - The unique identifier for the email input field.
 */
function attachEmailValidationEvents(id) {
    const emailId = `email${id}`; // Generate the email input field ID
    const errorId = `email-error${id}`; // Generate the error message element ID
    
    const emailField = document.getElementById(emailId); // Get the email input field element
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|gov|edu)$/; // Regular expression to validate email format

    /**
     * Validates the email address input field.
     * 
     * This function checks if the email address matches the specified pattern and 
     * displays an error message if the email is invalid.
     */
    function validate() {
        validateField(emailId, errorId, !emailRegex.test(emailField.value), "Please enter a valid email.");
    }

    // Attach event listener for validation on input event for the email field
    emailField.addEventListener('input', validate);
}


/*************************************************
 * Contact Field Creation
************************************************/

const CONTACT_SPACING = 10; // Constant defining the spacing between contact fields

/**
 * Gets the ID of the most recently created element with the specified class.
 * 
 * This function is used to dynamically insert new fields relative to the last created 
 * element of a specific class (e.g., name-fields or error-label).
 * 
 * @param {string} className - The class name of the elements to search for.
 * @returns {string} - The ID of the most recently created element with the specified class.
 */
function getLastCreatedIdByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    return elements[elements.length - 1].id; // Return the ID of the last element in the NodeList
}

/**
 * Generates a dropdown menu for selecting the relation to the applicant.
 * 
 * This uses the createFieldManager to generate a select element with various options 
 * representing the possible relationships (e.g., Parent, Spouse, Friend). 
 * 
 * @param {function} templateGenerator - A function that generates the HTML template for the field. 
 * @param {function} [validationCallback=null] - A callback function that applies validation to the generated field.
 * @param {function} [afterPostCallback=null] - An optional callback function for additional processing after the field has been inserted.
 */
const addRelation = createFieldManager(
    (id, margin, isRequired) => `
        <label for="contact${id}-relation" class="input-label">Relation to Applicant</label>
        <select id="contact${id}-relation">
            <option value="none" disabled selected>No Selection (Optional)</option>
            <option value="parent">Parent</option>
            <option value="child">Child</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="employer">Employer</option>
            <option value="employee">Employee</option>
            <option value="partner">Partner</option>
            <option value="other-relative">Other Relative</option>
            <option value="other">Other</option>
        </select>
    `, 
    null, 
    null
);

/**
 * Generates a contact section with input fields for name, phone, email, and relation.
 * 
 * This uses the createFieldManager to generate a contact section, which includes fields 
 * for the contact's name, phone number, email address, and relation to the applicant.
 * The first contact generated is labeled as "Primary Contact", and subsequent contacts 
 * are labeled as "Secondary Contact".
 * 
 * @param {function} templateGenerator - A function that generates the HTML template for the field. 
 * @param {function} [validationCallback=null] - A callback function that applies validation to the generated field.
 * @param {function} [afterPostCallback=null] - An optional callback function for additional processing after the field has been inserted.
 */
const addContact = createFieldManager(
    (id, margin, isRequired) => `
        <div id="contact${id}" class="contact" style="margin-top: ${margin}px">
            ${id == 1 ? 'Primary Contact' : 'Secondary Contact'}${isRequired ? ' *' : ''} 
        </div>
    `, 
    null, 
    (id, isRequired) => {
        // Adding nested fields for the contact section
        addName(`contact${id}`, 'beforeend', CONTACT_SPACING, isRequired);
        addPhone(getLastCreatedIdByClass('name-fields'), 'afterend', CONTACT_SPACING, isRequired);
        addEmail(getLastCreatedIdByClass('error-label'), 'afterend', CONTACT_SPACING, false);
        addRelation(getLastCreatedIdByClass('error-label'), 'afterend', CONTACT_SPACING, false);
    }
);
