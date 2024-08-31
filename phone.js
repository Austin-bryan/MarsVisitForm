const addPhone = createFieldManager(
    (id, margin, isRequired) => `
        <input class="phone" type="tel" id="phone${id}" name="phone" style="margin-top: ${margin}px" placeholder="(555)-555-5555${isRequired ? ' *' : ''}" maxlength="14"${isRequired ? ' required' : ''}>
        <span id="phone-error${id}" class="error-label">Please enter a valid phone number.</span>
    `, attachPhoneValidationEvents);

function attachPhoneValidationEvents(id) {
    const phoneId = `phone${id}`;
    const errorId = `phone-error${id}`;
    const phoneField = document.getElementById(phoneId);
    
    function validateNumber() {
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

    phoneField.addEventListener('input', validateNumber);
    phoneField.addEventListener('input', formateNumber);
    phoneField.addEventListener('change', validateNumber);
    phoneField.addEventListener('change', formateNumber);
}