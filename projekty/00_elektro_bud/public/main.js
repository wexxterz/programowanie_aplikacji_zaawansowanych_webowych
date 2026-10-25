// Główny funkcjonal: Wyświetlanie, dodawanie i usuwanie produktów
// Aplikacja trwale przechowuje dane w localStorage
// Następujące rzeczy zostały obsłużone:
// zapis danych, odczyt danych, brak zapisanych danych i aktualizacje danych
//#region Import
import { Category, Status } from "./types.js";
//#endregion
//#region HTML Elements
const form = document.querySelector("#form");
const eanCodeInput = document.querySelector('#eanCodeInput');
const nameInput = document.querySelector('#nameInput');
const priceInput = document.querySelector('#priceInput');
const costPriceInput = document.querySelector('#costPriceInput');
const quantityInput = document.querySelector('#quantityInput');
const imageURLInput = document.querySelector('#imageInput');
const sectorInput = document.querySelector('#sectorInput');
const rackInput = document.querySelector('#rackInput');
const shelfInput = document.querySelector('#shelfInput');
const categorySelect = document.querySelector('#categorySelect');
const statusSelect = document.querySelector('#statusSelect');
const addProductBtn = document.querySelector('#addProductBtn');
const tableWrapperDiv = document.querySelector('#tableWrapperDiv');
//#endregion
const productKeys = [
    'id',
    'eanCode',
    'name',
    'price',
    'costPrice',
    'quantity',
    'category',
    'status',
    'storageLocation',
    'imageURL'
];
const columnTitles = {
    id: 'ID',
    eanCode: "EAN Code",
    name: 'Name',
    price: 'Price',
    costPrice: 'Cost Price',
    quantity: 'Quantity',
    category: 'Category',
    status: 'Status',
    storageLocation: 'Storage Location',
    imageURL: 'Image URL'
};
let products = [];
//#region Initialization
onStart();
//#endregion
//#region Event Listeners
addProductBtn?.addEventListener("click", (e) => {
    handleAddProductClick(e);
});
//#endregion
//#region Function Declaration
function onStart() {
    loadOptions();
    products = getProductsFromLocalStorage();
    drawTable();
}
function updateProducts(newProducts) {
    products = newProducts;
    saveProductsInLocalStorage();
    drawTable();
}
function loadOptions() {
    if (!categorySelect || !statusSelect)
        return;
    let catInnerHTML = '';
    Object.values(Category).forEach(cat => {
        catInnerHTML += `<option value="${cat}">${cat}</option>`;
    });
    let statInnerHTML = '';
    Object.values(Status).forEach(stat => {
        statInnerHTML += `<option value="${stat}">${stat}</option>`;
    });
    categorySelect.innerHTML = catInnerHTML;
    statusSelect.innerHTML = statInnerHTML;
}
function handleAddProductClick(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!eanCodeInput || !nameInput || !priceInput
        || !costPriceInput || !quantityInput || !categorySelect
        || !statusSelect || !imageURLInput || !sectorInput
        || !rackInput || !shelfInput) {
        console.log("Nie znaleziono elementow formularza!");
        return;
    }
    const newProduct = createProduct(eanCodeInput.value, nameInput.value, Number(priceInput.value), Number(costPriceInput.value), Number(quantityInput.value), categorySelect.value, statusSelect.value, createStorageLocation(sectorInput.value, rackInput.value, shelfInput.value), imageURLInput.value);
    updateProducts([...products, newProduct]);
    form.reset();
}
function handleRemoveProductClick(e, id) {
    removeProductById(id);
}
function createProduct(eanCode, name, price, costPrice, quantity, category, status, storageLocation, imageURL) {
    return {
        id: Date.now(),
        eanCode: eanCode,
        name: name,
        price: price,
        costPrice: costPrice,
        quantity: quantity,
        category: category,
        status: status,
        imageURL: imageURL,
        storageLocation: storageLocation
    };
}
function createStorageLocation(sector, rack, shelf) {
    return {
        sector: sector,
        rack: rack,
        shelf: shelf
    };
}
function saveProductsInLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}
function getProductsFromLocalStorage() {
    let data = localStorage.getItem('products');
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}
function removeProductById(id) {
    const filtered = products.filter(item => item.id !== id);
    updateProducts(filtered);
}
function drawTable() {
    clearTable();
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    productKeys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = columnTitles[key];
        th.classList.add('text-center');
        tr.appendChild(th);
    });
    const thRemove = document.createElement('th');
    thRemove.textContent = 'Remove?';
    tr.appendChild(thRemove);
    thead.appendChild(tr);
    table.appendChild(thead);
    products.forEach(product => {
        const tr = document.createElement('tr');
        for (let i = 0; i < productKeys.length - 2; i++) {
            const td = document.createElement('td');
            td.textContent = String(product[productKeys[i]]);
            td.classList.add('text-center');
            tr.appendChild(td);
        }
        const tdLoc = document.createElement('td');
        tdLoc.textContent = `${product.storageLocation.sector}/${product.storageLocation.rack}/${product.storageLocation.shelf}`;
        tdLoc.classList.add('text-center');
        tr.appendChild(tdLoc);
        const tdImg = document.createElement('td');
        const img = document.createElement('img');
        img.src = product.imageURL;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        tdImg.classList.add('text-center');
        tdImg.appendChild(img);
        tr.appendChild(tdImg);
        const tdRemove = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'theme-danger btn-solid';
        removeBtn.addEventListener('click', (e) => handleRemoveProductClick(e, product.id));
        tdRemove.appendChild(removeBtn);
        tr.appendChild(tdRemove);
        tbody.appendChild(tr);
    });
    if (tbody.children.length === 0) {
        const td = document.createElement('td');
        td.colSpan = productKeys.length;
        td.textContent = 'No products found';
        td.className = 'text-center text-2xl pt-5';
        tbody.appendChild(td);
    }
    table.appendChild(tbody);
    table.classList.add('table');
    tableWrapperDiv.appendChild(table);
}
function clearTable() {
    if (!tableWrapperDiv)
        return;
    tableWrapperDiv.innerHTML = '';
}
//#endregion
