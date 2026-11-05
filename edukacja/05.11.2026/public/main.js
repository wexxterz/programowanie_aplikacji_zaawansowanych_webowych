
const addButton = document.querySelector("#todoAddButton");
const inputTextField = document.querySelector("#todoInputField");
const todosContainer = document.querySelector("#todosContainer");
let arrayOfTodos = [];
if (addButton && inputTextField && todosContainer) {
    addButton?.addEventListener('click', (e) => {
        let wynik = inputTextField?.value;
        let newTodo = new TodoEntry(arrayOfTodos.length, inputTextField.value);
        arrayOfTodos.push(newTodo);
        inputTextField.value = '';
        console.log("todo: ", newTodo);
        buildList();
    });
}
function buildList() {
    todosContainer.innerHTML = "";
    arrayOfTodos.forEach(element => {
        todosContainer.innerHTML += element.render();
    });
}
