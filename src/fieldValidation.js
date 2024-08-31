/**
 * Validates a form field by checking a specified condition and displaying an error message if the condition is true.
 * 
 * This function is intended to be used for form validation. It checks a given condition related to a form field, 
 * and if the condition is true (indicating an error), it will update the DOM to show an error message next to the field. 
 * If the condition is false, it clears any previous error message and styling.
 * 
 * @param {string} fieldId - The ID of the form field to validate.
 * @param {string} errorId - The ID of the element where the error message should be displayed.
 * @param {boolean} errorCondition - A boolean expression representing the validation condition. If true, an error exists.
 * @param {string} errorMessage - The error message to display if the errorCondition is true.
 * @returns {boolean} - Returns true if no error exists (errorCondition is false), otherwise returns false.
 */
function validateField(fieldId, errorId, errorCondition, errorMessage) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (errorCondition) {
        console.log(`Error exists: ${fieldId}, ${errorMessage}`);
        field.classList.add('error-border');
        error.textContent = errorMessage;
        error.style.display = 'block';
        return false;
    } else {
        console.log(`No error: ${fieldId}`);
        field.classList.remove('error-border');
        error.style.display = 'none';
        return true;
    }
}

// Node.js (Jest) environment export
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        validateField
    };
}