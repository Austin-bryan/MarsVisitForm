let idCounter = 0;

function createNameManager() {
    let idCounter = 0; 

    return function(beforeElementId) {
        const beforeElement = document.getElementById(beforeElementId);
        const id = ++idCounter; // Increment the counter
        const template = `
            <div id="name-fields${id}" class="name-fields">
                <input type="text" id="first-name${id}" name="first-name${id}" placeholder="First Name *" required>
                <input type="text" id="last-name${id}" name="last-name${id}" placeholder="Last Name *" required>
            </div>
            <span id="name-error${id}" class="error-label">Please enter a valid name.</span>
        `;
        beforeElement.insertAdjacentHTML('afterend', template);
        attachValidationEvents(`first-name${id}`, `last-name${id}`, `name-error${id}`);
    };
}

const addName = createNameManager();

function attachValidationEvents(firstNameId, lastNameId, errorId) {
    const firstName = document.getElementById(firstNameId);
    const lastName = document.getElementById(lastNameId);
    const nameError = document.getElementById(errorId);

    function updateName() {
        const isFirstNameValid = validateName(firstName.value);
        const isLastNameValid = validateName(lastName.value);

        // Update the error state for each field
        updateFieldErrorState(firstName, isFirstNameValid);
        updateFieldErrorState(lastName, isLastNameValid);

        // Only hide the error message if all names are valid
        if (isFirstNameValid && isLastNameValid) {
            nameError.style.display = 'none';
        } else {
            nameError.style.display = 'block';
        }
    }

    const textInputs = document.querySelectorAll('input[type="text"]');

    firstName.addEventListener('input', updateName);
    lastName.addEventListener('input', updateName);
}

function updateFieldErrorState(field, isValid) {
    if (isValid) {
        field.classList.remove('error-border');
    } else {
        field.classList.add('error-border');
    }
}

function validateName(name) {
    if (name.length == 0)
        return true;
    if (name.length < 2 || name.length > 50)
        return false;

    const nameRegex = /^[a-zA-Zà-ÿÀ-ß'-]+$/;
    if (!nameRegex.test(name)) 
        return false;

    if (/--|''/.test(name)) 
        return false;

    if (name.trim() !== name || name.includes("  ")) 
        return false;

    return true; // Name is valid
}