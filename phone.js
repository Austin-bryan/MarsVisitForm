
/*************************************************
 * Phone Field Creation
 ************************************************/

const addPhone = createFieldManager(
    (id, margin, isRequired) => `
        <input class="phone" type="tel" id="phone${id}" name="phone" style="margin-top: ${margin}px" placeholder="(555)-555-5555${isRequired ? ' *' : ''}" maxlength="14"${isRequired ? ' required' : ''}>
        <span id="phone-error${id}" class="error-label">Please enter a valid phone number.</span>
    `, attachPhoneValidationEvents);

function attachPhoneValidationEvents(id) {
    const phoneId = `phone${id}`;
    const errorId = `phone-error${id}`;
    const phoneField = document.getElementById(phoneId);
    
    function validate() {
        validateField(phoneId, errorId, phoneField.value.length != 14, "Please enter a valid phone number.");
    };
    
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

        e.target.value = formatted;
    }

    phoneField.addEventListener('input', validate);
    phoneField.addEventListener('input', formateNumber);
    phoneField.addEventListener('change', validate);
    phoneField.addEventListener('change', formateNumber);
}

/*************************************************
 * Name Field Creation
 ************************************************/

const addName = createFieldManager(
    (id, margin, isRequired) => `
        <div id="name-fields${id}" class="name-fields">
            <input type="text" id="first-name${id}" name="first-name${id}" style="margin-top: ${margin}px" placeholder="First Name${isRequired ? ' *' : ''}"${isRequired ? ' required' : ''}>
            <input type="text" id="last-name${id}" name="last-name${id}" style="margin-top: ${margin}px" placeholder="Last Name${isRequired ? ' *' : ''}"${isRequired ? ' required' : ''}>
        </div>
        <span id="name-error${id}" class="error-label">Please enter a valid name.</span>
    `, attachNameValidationEvents
)

function attachNameValidationEvents(id) {
    const firstNameId = `first-name${id}`;
    const lastNameId = `last-name${id}`;
    const errorId = `name-error${id}`;

    const firstName = document.getElementById(firstNameId);
    const lastName = document.getElementById(lastNameId);

    function validate() {
        if (!validateField(firstNameId, errorId, !validateName(firstName.value), "Please enter a valid first name."))
            return;
        validateField(lastNameId, errorId, !validateName(lastName.value), "Please enter a valid last name.");
    }

    firstName.addEventListener('input', validate);
    lastName.addEventListener('input', validate);
}

function validateName(name) {
    if (name.length == 0)
        return true;
    if (name.length < 2 || name.length > 50)
        return false;   

    const nameRegex = /^[a-zA-Zà-ÿÀ-ß '-]+$/;
    if (!nameRegex.test(name)) 
        return false;
    if (/--|''/.test(name)) 
        return false;    
    if (name.trim() !== name || name.includes("  ")) 
        return false;

    return true; // Name is valid
}


/*************************************************
 * Email Field Creation
************************************************/

const addEmail = createFieldManager(
    (id, margin, isRequired) => `
        <input id="email${id}" type="email" name="email" placeholder="email@example.com${isRequired ? " *" : ""}" style="margin-top: ${margin}px"${isRequired ? " required" : ""}>
        <span id="email-error${id}" class="error-label">Please enter a valid email address.</span>
    `, attachEmailValidationEvents
);

function attachEmailValidationEvents(id) {
    const emailId = `email${id}`;
    const errorId = `email-error${id}`;
    
    const emailField = document.getElementById(emailId);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|gov|edu)$/;

    function validate() {
        validateField(emailId, errorId, !emailRegex.test(emailField.value), "Please enter a valid email.");
    }
    emailField.addEventListener('input', validate);
}


/*************************************************
 * Contact Field Creation
************************************************/

const CONTACT_SPACING = 10;

function getLastCreatedIdByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    return elements[elements.length - 1].id;
}

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
    `, null, null);

const addContact = createFieldManager(
    (id, margin, isRequired) => `
        <div id="contact${id}" class="contact" style="margin-top: ${margin}px">
            ${id == 1 ? 'Primary Contact' : 'Secondary Contact'}${isRequired ? ' *' : ''} 
        </div>
    `, null, (id, isRequired) => {
        addName(`contact${id}`, 'beforeend', CONTACT_SPACING, isRequired);
        addPhone(getLastCreatedIdByClass('name-fields'), 'afterend', CONTACT_SPACING, isRequired);
        addEmail(getLastCreatedIdByClass('error-label'), 'afterend', CONTACT_SPACING, false);
        addRelation(getLastCreatedIdByClass('error-label'), 'afterend', CONTACT_SPACING, false);
    });