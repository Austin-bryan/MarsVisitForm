function validateField(fieldId, errorId, errorCondition, errorMessage) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (errorCondition) {
        console.log('true')
        field.classList.add('error-border');
        error.textContent = errorMessage;
        error.style.display = 'block';
        return false;
    } else {
        console.log('false')
        field.classList.remove('error-border');
        error.style.display = 'none';
        return true;
    }
}