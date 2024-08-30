function createNameManager() {
    let idCounter = 0; 

    return function(adjacentHTMLId, insertPosition, margin) {
        const adjacentHTML = document.getElementById(adjacentHTMLId);
        const id = ++idCounter; 
        const template = `
            <div id="name-fields${id}" class="name-fields">
                <input type="text" id="first-name${id}" name="first-name${id}" style="margin-top: ${margin}px" placeholder="First Name *" required>
                <input type="text" id="last-name${id}" name="last-name${id}" style="margin-top: ${margin}px" placeholder="Last Name *" required>
            </div>
            <span id="name-error${id}" class="error-label">Please enter a valid name.</span>
        `;
        adjacentHTML.insertAdjacentHTML(insertPosition, template);
        attachValidationEvents(`first-name${id}`, `last-name${id}`, `name-error${id}`);
    };
}

const addName = createNameManager();

function attachValidationEvents(firstNameId, lastNameId, errorId) {
    const firstName = document.getElementById(firstNameId);
    const lastName = document.getElementById(lastNameId);

    function updateName() {
        if (!validateField(firstNameId, errorId, !validateName(firstName.value), "Please enter a valid first name."))
            return;
        validateField(lastNameId, errorId, !validateName(lastName.value), "Please enter a valid last name.");
    }

    firstName.addEventListener('input', updateName);
    lastName.addEventListener('input', updateName);
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