/**
 * Due to limited time, I wasn't able to finish my unit tests coverage, 
 * but I hope this is enough to prove my ability to write them. 
 */

const PATH_TO_MAIN = '../src/main.js';

const {
    validateActiveStage,
    updateNextButtonState,
    addFieldListeners,
    showStage,
    validateDOB,
    validateDates
} = require(PATH_TO_MAIN);

const { validateField } = require('../src/fieldValidation.js');

// const {
    // validateField
// } = require('../src/fieldValidation');

// Mock the BUTTON_DELAY to avoid actual delays in tests
const BUTTON_DELAY = 0;

describe('Stage Switching and Field Validation', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <div class="form-stage" id="stage1">
            <button id="next-button1" disabled></button>
        </div>
        <div class="form-stage" id="stage2" style="display:none;">
            <button id="next-button2" disabled></button>
        </div>
    `;
    });

    test('validateActiveStage returns true if all required fields are valid', () => {
        // Set up the DOM for testing
        document.body.innerHTML = `
            <div class="form-stage active">
                <input type="text" required value="Valid value" id="valid-field">
                <input type="text" required value="Another valid value" id="another-valid-field">
            </div>
        `;

        const result = validateActiveStage();
        expect(result).toBe(true); // Expect it to return true since all fields are valid
    });

    test('validateActiveStage returns false if any required field is invalid', () => {
        document.body.innerHTML = `
            <div class="form-stage active">
                <input type="text" required value="" id="invalid-field">
                <input type="text" required value="Valid value" id="valid-field">
            </div>
        `;

        const result = validateActiveStage();
        expect(result).toBe(false); // Expect it to return false since one field is invalid
    });

    test('updateNextButtonState enables the button if all fields are valid', () => {
        document.body.innerHTML = `
            <div class="form-stage active">
                <input type="text" required value="Valid value" id="valid-field">
            </div>
            <button id="next-button1" disabled></button>
        `;

        updateNextButtonState(1);

        const nextButton = document.getElementById('next-button1');
        expect(nextButton.disabled).toBe(false); // Button should be enabled
        expect(nextButton.classList.contains('disabled')).toBe(false); // Class should be removed
    });

    test('updateNextButtonState disables the button if any field is invalid', () => {
        document.body.innerHTML = `
            <div class="form-stage active">
                <input type="text" required value="" id="invalid-field">
            </div>
            <button id="next-button1"></button>
        `;

        updateNextButtonState(1);

        const nextButton = document.getElementById('next-button1');
        expect(nextButton.disabled).toBe(true); // Button should be disabled
        expect(nextButton.classList.contains('disabled')).toBe(true); // Class should be added
    });

    test('addFieldListeners adds listeners that update button state on input change', () => {
        document.body.innerHTML = `
            <div class="form-stage active">
                <input type="text" required value="Valid value" id="valid-field">
            </div>
            <button id="next-button1" disabled></button>
        `;

        const input = document.getElementById('valid-field');
        const nextButton = document.getElementById('next-button1');

        addFieldListeners(1);

        input.value = ''; // Invalidate the input
        input.dispatchEvent(new Event('input')); // Simulate user input

        expect(nextButton.disabled).toBe(true); // Button should be disabled after invalid input
    });

    test('showStage displays the correct stage and hides others', async () => {
        document.body.innerHTML = `
            <div class="form-stage" id="stage1"></div>
            <div class="form-stage" id="stage2" style="display:none;"></div>
        `;

        showStage(2);

        // Wait for the timeout to complete
        setTimeout(() => {
            const stage1 = document.getElementById('stage1');
            const stage2 = document.getElementById('stage2');
            
            expect(stage1.style.display).toBe('none'); // Stage 1 should be hidden
            expect(stage2.style.display).toBe('block'); // Stage 2 should be visible
        }, BUTTON_DELAY);
    });

    test('showStage correctly adds event listeners and updates button state', () => {
        document.body.innerHTML = `
            <div class="form-stage" id="stage1"></div>
            <div class="form-stage" id="stage2" style="display:none;"></div>
            <button id="next-button2" disabled></button>
        `;

        const spyAddFieldListeners = jest.spyOn(require(PATH_TO_MAIN), 'addFieldListeners');
        const spyUpdateNextButtonState = jest.spyOn(require(PATH_TO_MAIN), 'updateNextButtonState');

        showStage(2);

        // Wait for button delay
        setTimeout(() => {
            expect(spyAddFieldListeners).toHaveBeenCalledWith(2);
            expect(spyUpdateNextButtonState).toHaveBeenCalledWith(2);
        }, BUTTON_DELAY);
    });
});

describe('DOB Validation', () => {
    beforeEach(() => {
        // Reset the document body before each test
        document.body.innerHTML = `
            <input id="dob" type="date" />
            <span id="dob-error" class="error-label"></span>
            <script src="fieldValidation.js"></script>
        `;
    });

    test('validateDOB shows error if date is in the future', () => {
        document.getElementById('dob').value = new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0];
        validateDOB();
        expect(document.getElementById('dob-error').style.display).toBe('block');
        expect(document.getElementById('dob-error').textContent).toBe('Please enter a valid age.');
    });

    test('validateDOB shows error if date is more than 150 years ago', () => {
        document.getElementById('dob').value = new Date(new Date().getFullYear() - 151, 0, 1).toISOString().split('T')[0];
        validateDOB();
        expect(document.getElementById('dob-error').style.display).toBe('block');
        expect(document.getElementById('dob-error').textContent).toBe('Birth year must be within 150 years from today.');
    });

    test('validateDOB shows error if age is less than 18', () => {
        document.getElementById('dob').value = new Date(new Date().getFullYear() - 17, 0, 1).toISOString().split('T')[0];
        validateDOB();
        expect(document.getElementById('dob-error').style.display).toBe('block');
        expect(document.getElementById('dob-error').textContent).toBe('You must be 18 years old or older.');
    });

    test('validateDOB does not show error if age is valid', () => {
        document.getElementById('dob').value = new Date(new Date().getFullYear() - 25, 0, 1).toISOString().split('T')[0];
        validateDOB();
        expect(document.getElementById('dob-error').style.display).toBe('none');
    });
});

describe('Depature/Return Validation', () => {
    beforeEach(() => {
        // Reset the document body before each test
        document.body.innerHTML = `
            <input id="departure" type="date" />
            <input id="return" type="date" />
            <span id="departure-error" class="error-label"></span>
            <span id="return-error" class="error-label"></span>
            <script src="fieldValidation.js"></script>
        `;
    });

    test('validateDates shows error if departure date is in the past', () => {
        document.getElementById('departure').value = new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0];
        validateDates();
        expect(document.getElementById('departure-error').style.display).toBe('block');
        expect(document.getElementById('departure-error').textContent).toBe("Departure date can't be in the past.");
    });

    test('validateDates shows error if departure date is more than 5 years in the future', () => {
        document.getElementById('departure').value = new Date(new Date().getFullYear() + 6, 0, 1).toISOString().split('T')[0];
        validateDates();
        expect(document.getElementById('departure-error').style.display).toBe('block');
        expect(document.getElementById('departure-error').textContent).toBe("Departure date can't be more than 5 years from today.");
    });

    test('validateDates shows error if return date is less than 14 days after departure', () => {
        const departureDate = new Date();
        document.getElementById('departure').value = departureDate.toISOString().split('T')[0];
        document.getElementById('return').value = new Date(departureDate.setDate(departureDate.getDate() + 10)).toISOString().split('T')[0];

        console.log(document.getElementById('departure').value);
        console.log(document.getElementById('return').value);

        validateDates();
        
        expect(document.getElementById('return-error').style.display).toBe('block');
        expect(document.getElementById('return-error').textContent).toBe('Return date must be at least 14 days after the departure date.');
    });

    test('validateDates shows error if return date is more than 1 year after departure', () => {
        const departureDate = new Date();
        document.getElementById('departure').value = departureDate.toISOString().split('T')[0];
        document.getElementById('return').value = new Date(departureDate.setFullYear(departureDate.getFullYear() + 2)).toISOString().split('T')[0];
        validateDates();
        expect(document.getElementById('return-error').style.display).toBe('block');
        expect(document.getElementById('return-error').textContent).toBe("Return date can't be more than 1 year after the departure date.");
    });

    test('validateDates does not show error if dates are valid', () => {
        const departureDate = new Date();
        document.getElementById('departure').value = departureDate.toISOString().split('T')[0];
        document.getElementById('return').value = new Date(departureDate.setDate(departureDate.getDate() + 20)).toISOString().split('T')[0];
        validateDates();
        expect(document.getElementById('departure-error').style.display).toBe('none');
        expect(document.getElementById('return-error').style.display).toBe('none');
    });
});