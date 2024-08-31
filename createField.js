// function createFieldManager(templateGenerator, validationCallback, afterPostCallback = null) {
//     let idCounter = 0;

//     return function(adjacentHTMLId, insertPosition, margin, isRequired = false) {
//         const adjacentHTML = document.getElementById(adjacentHTMLId);
//         const id = ++idCounter;
//         const template = templateGenerator(id, margin, isRequired);

//         adjacentHTML.insertAdjacentHTML(insertPosition, template,);

//         if (validationCallback) {
//             validationCallback(id);
//         }

//         if (afterPostCallback) {
//             afterPostCallback(id, isRequired);  // Used to add nested elements
//         }
//     }
// }
