const BUTTON_DELAY = 100; // Used to provide visual feeedback of button press

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    /************************************************************************
     * IMPORTANT: move this line out of this if statement for the tests to work.
     * Due to a time crunch, I wasn't able to find a more elagent solution
     * to allow this to work both in browser and unit tests.
     ************************************************************************/
    const { validateField } = require('./fieldValidation'); 
    module.exports = {
        validateActiveStage,
        updateNextButtonState,
        addFieldListeners,
        showStage,
        validateDOB,
        validateDates
    };
}

// const { validateField } = require('./fieldValidation');

/*************************************************
 * Form Initialization
 ************************************************/

/**
 * Sets up contact input fields for the form.
 */
function setupContactInputFields() {
    addName("client-name-label", 'afterend', 0, true);
    addPhone("client-phone-label", 'afterend', 0, true);
    addEmail("client-email-label", 'afterend', 0, true);
    addContact("emergency-label", 'beforeend', 10, true);
}

/**
 * Initializes the form by setting up event listeners, displaying the first stage,
 * and setting up contact input fields.
 */
function initializeForm() {
    const startStage = 2;   // This is used to skip having to fill out earlier stages.

    setupContactInputFields();
    addFieldListeners(startStage);
    showStage(startStage);
    addEventListeners();
}

/**
 * Adds event listeners to all created UI elements.
 */
function addEventListeners() { 
    document.getElementById('dob').addEventListener('input', validateDOB);
    document.getElementById('departure').addEventListener('input', validateDates);
    document.getElementById('return').addEventListener('input', validateDates);
    document.getElementById('secondary-button').addEventListener('click', addSecondaryContact)
}

/*************************************************
 * Stage Switching and Field Validation
 ************************************************/

/**
 * Validates all required fields in the active form stage.
 * @returns {boolean} True if all required fields are valid, false otherwise.
 */
function validateActiveStage() {
    const activeStage = document.querySelector('.form-stage.active');
    let isValid = true;

    const requiredFields = activeStage.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value || field.value.trim().length === 0 || field.classList.contains('error-border')) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Updates the state of the "Next" button based on the validation status of the current stage.
 * @param {number} stageNumber - The stage number to validate.
 */
function updateNextButtonState(stageNumber) {
    const nextButton = document.getElementById(`next-button${stageNumber}`);

    if (validateActiveStage() && nextButton) {
        nextButton.classList.remove('disabled');
        nextButton.disabled = false;
    } else if (nextButton) {
        nextButton.classList.add('disabled');
        nextButton.disabled = true;
    }
}

/**
 * Adds event listeners to required fields in the active form stage to trigger validation.
 * @param {number} stageNumber - The stage number to add listeners to.
 */
function addFieldListeners(stageNumber) {
    const activeStage = document.querySelector('.form-stage.active');
    const fields = activeStage.querySelectorAll('[required]');

    fields.forEach(field => {
        field.addEventListener('input', () => updateNextButtonState(stageNumber));
        field.addEventListener('change', () => updateNextButtonState(stageNumber));
    });
}

/**
 * Switches between form stages, ensuring the correct stage is displayed and validated.
 * @param {number} stageNumber - The stage number to display.
 */
function showStage(stageNumber) {
    setTimeout(() => {
        const stages = document.querySelectorAll('.form-stage');

        stages.forEach((stage, index) => {
            if (index + 1 === stageNumber) {
                stage.classList.add('active');
                stage.style.display = 'block';
            } else {
                stage.classList.remove('active');
                stage.style.display = 'none';
            }
        });

        addFieldListeners(stageNumber);
        updateNextButtonState(stageNumber);
    }, BUTTON_DELAY);
}

/*************************************************
 * Date Validation
 ************************************************/

/**
 * Validates the Date of Birth field, ensuring the age is between 18 and 150 years.
 */
function validateDOB() {
    const dobValue = new Date(document.getElementById('dob').value);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());

    if (!validateField('dob', 'dob-error', dobValue > today, "Please enter a valid age.")) 
        return;
    if (!validateField('dob', 'dob-error', dobValue < maxDate, "Birth year must be within 150 years from today."))
         return;
    validateField('dob', 'dob-error', dobValue > minDate, "You must be 18 years old or older.");
}

/**
 * Validates the Departure and Return Date fields to ensure the dates are logical.
 */
function validateDates() {
    const departureField = document.getElementById('departure');
    const returnField = document.getElementById('return');

    const rawInputValue = document.getElementById('departure').value;
    
    // Ensure the date is parsed correctly with the local time zone
    const departureDate = new Date(rawInputValue + 'T00:00:00'); // Set time to midnight local time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    
    const returnDate = new Date(returnField.value);
    const twoWeeksLater = new Date(departureDate);
    const oneYearLater = new Date(departureDate);
    const maxFutureDate = new Date(today);

    maxFutureDate.setFullYear(today.getFullYear() + 5);
    twoWeeksLater.setDate(departureDate.getDate() + 14);
    oneYearLater.setFullYear(departureDate.getFullYear() + 1);

    if (!validateField('departure', 'departure-error', departureDate < today, "Departure date can't be in the past.")) 
        return;
    if (!validateField('departure', 'departure-error', departureDate > maxFutureDate, `Departure date can't be more than 5 years from today.`)) 
        return;
    if (!validateField('return', 'return-error', returnDate < twoWeeksLater, "Return date must be at least 14 days after the departure date.")) 
        return;
    validateField('return', 'return-error', returnDate > oneYearLater, "Return date can't be more than 1 year after the departure date.");
}

/*************************************************
 * Secondary Contact Button Event
 ************************************************/

/**
 * Handles the addition of a secondary contact when the relevant button is clicked.
 */
function addSecondaryContact() {
    const secondaryButton = document.getElementById('secondary-button');
    secondaryButton.classList.add('fade-out');

    setTimeout(() => {
        secondaryButton.style.display = 'none';

        addContact('contact1', 'afterend', 15, false);
        const newContact = document.getElementById('contact2');
        newContact.classList.add('fade-in');

        setTimeout(() => {
            newContact.classList.add('show');
        }, 10); // Small delay to allow the element to be in the DOM before applying opacity
    }, 100);
};
