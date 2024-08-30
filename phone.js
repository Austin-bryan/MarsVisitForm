                    

function createPhoneManager() {
    let idCounter = 0; 

    return function(beforeElementId, margin) {
        const beforElement = document.getElementById(beforeElementId);
        const id = ++idCounter; // Increment the counter
        const template = `
            <input class="error" type="tel" id="phone${id}" name="phone" style="margin-top: ${margin}px" placeholder="(555)-555-5555 *" maxlength="14" required>
            <span id="phone-error${id}" class="error-label">Please enter a valid phone number.</span>
        `;
        beforElement.insertAdjacentHTML('afterend', template);
        attachPhoneValidationEvents(`phone${id}`, `phone-error${id}`);
    };
}

const addPhone = createPhoneManager();

function attachPhoneValidationEvents(phoneId, errorId) {
    const phoneField = document.getElementById(phoneId);
    const phoneError = document.getElementById(errorId);

    function validateNumber() {
        if (phoneField.value.length < 14) {
            phoneField.classList.add('error-border');
            phoneError.style.display = 'block';
        } else {
            phoneField.classList.remove('error-border');
            phoneError.style.display = 'none';
        }
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

    phoneField.addEventListener('input', validateNumber);
    phoneField.addEventListener('input', formateNumber);
    phoneField.addEventListener('change', validateNumber);
    phoneField.addEventListener('change', formateNumber);
}