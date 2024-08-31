// const CONTACT_SPACING = 10;

// function getLastCreatedIdByClass(className) {
//     const elements = document.querySelectorAll(`.${className}`);
//     return elements[elements.length - 1].id;
// }

// const addRelation = createFieldManager(
//     (id, margin, isRequired) => `
//     <label for="contact${id}-relation" class="input-label">Relation to Applicant</label>
//         <select id="contact${id}-relation">
//             <option value="none" disabled selected>No Selection (Optional)</option>
//             <option value="parent">Parent</option>
//             <option value="child">Child</option>
//             <option value="spouse">Spouse</option>
//             <option value="sibling">Sibling</option>
//             <option value="friend">Friend</option>
//             <option value="colleague">Colleague</option>
//             <option value="employer">Employer</option>
//             <option value="employee">Employee</option>
//             <option value="partner">Partner</option>
//             <option value="other-relative">Other Relative</option>
//             <option value="other">Other</option>
//         </select>
//     `, null, null);

// const addContact = createFieldManager(
//     (id, margin, isRequired) => `
//         <div id="contact${id}" class="contact" style="margin-top: ${margin}px">
//             ${id == 1 ? 'Primary Contact' : 'Secondary Contact'}${isRequired ? ' *' : ''} 
//         </div>
//     `, null, (id, isRequired) => {
//         addName(`contact${id}`, 'beforeend', CONTACT_SPACING, isRequired);
//         addPhone(getLastCreatedIdByClass('name-fields'), 'afterend', CONTACT_SPACING, isRequired);
//         addRelation(getLastCreatedIdByClass('phone'), 'afterend', CONTACT_SPACING, false);
//     });