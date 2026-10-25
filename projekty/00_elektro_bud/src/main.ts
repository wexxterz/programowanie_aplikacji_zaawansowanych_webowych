// Główny funkcjonal: Wyświetlanie, dodawanie i usuwanie produktów
// Aplikacja trwale przechowuje dane w localStorage
// Następujące rzeczy zostały obsłużone:
// zapis danych, odczyt danych, brak zapisanych danych i aktualizacje danych

//#region Import
import {Category, Product, Status, StorageLocation} from "./types";
//#endregion

//#region HTML Elements
const form: HTMLFormElement = document.querySelector("#form")!;

const eanCodeInput: HTMLInputElement = document.querySelector('#eanCodeInput')!;
const nameInput: HTMLInputElement = document.querySelector('#nameInput')!;
const priceInput: HTMLInputElement = document.querySelector('#priceInput')!;
const costPriceInput: HTMLInputElement = document.querySelector('#costPriceInput')!;
const quantityInput: HTMLInputElement = document.querySelector('#quantityInput')!;
const imageURLInput: HTMLInputElement = document.querySelector('#imageInput')!;
const sectorInput: HTMLInputElement = document.querySelector('#sectorInput')!;
const rackInput: HTMLInputElement = document.querySelector('#rackInput')!;
const shelfInput: HTMLInputElement = document.querySelector('#shelfInput')!;

const categorySelect: HTMLSelectElement = document.querySelector('#categorySelect')!;
const statusSelect: HTMLSelectElement = document.querySelector('#statusSelect')!;

const addProductBtn: HTMLButtonElement|null = document.querySelector('#addProductBtn');

const tableWrapperDiv: HTMLDivElement = document.querySelector('#tableWrapperDiv')!;
//#endregion

const productKeys: (keyof Product)[] = [
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

const columnTitles: Record<keyof Product, string> = {
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

let products: Product[] = [];

//#region Initialization
onStart();
//#endregion

//#region Event Listeners
addProductBtn?.addEventListener("click", (e: Event):void => {
    handleAddProductClick(e);
});
//#endregion

//#region Function Declaration
function onStart(): void {
    loadOptions();
    products = getProductsFromLocalStorage();
    drawTable();
}

function updateProducts(newProducts: Product[]): void {
    products = newProducts;
    saveProductsInLocalStorage();
    drawTable();
}

function loadOptions(): void {
    if (!categorySelect || !statusSelect) return;

    let catInnerHTML: string = '';
    Object.values(Category).forEach(cat => {
        catInnerHTML += `<option value="${cat}">${cat}</option>`;
    });

    let statInnerHTML: string = '';
    Object.values(Status).forEach(stat => {
        statInnerHTML += `<option value="${stat}">${stat}</option>`;
    });

    categorySelect.innerHTML = catInnerHTML;
    statusSelect.innerHTML = statInnerHTML;

}

function handleAddProductClick(e: Event): void {
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


    const newProduct: Product = createProduct(
        eanCodeInput.value, nameInput.value,
        Number(priceInput.value), Number(costPriceInput.value), Number(quantityInput.value),
        categorySelect.value as Category, statusSelect.value as Status,
        createStorageLocation(sectorInput.value, rackInput.value, shelfInput.value),
        imageURLInput.value
    );

    updateProducts([...products, newProduct]);

    form.reset();
}

function handleRemoveProductClick(e: Event, id: number): void {
    removeProductById(id);
}

function createProduct(eanCode: string, name: string, price: number, costPrice: number, quantity: number, category: Category, status: Status, storageLocation: StorageLocation, imageURL: string): Product {
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

function createStorageLocation(sector: string, rack: string, shelf: string): StorageLocation {
    return {
        sector: sector,
        rack: rack,
        shelf: shelf
    }
}

function saveProductsInLocalStorage(): void {
    localStorage.setItem('products', JSON.stringify(products));
}

function getProductsFromLocalStorage(): Product[] {
    let data: string | null = localStorage.getItem('products');

    if (!data) {
        return [];
    }

    return JSON.parse(data) as Product[];
}

function removeProductById(id: number): void {
    const filtered:Product[] = products.filter(item => item.id !== id);
    updateProducts(filtered);
}

function drawTable() : void{

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

    products.forEach(product=> {
        const tr = document.createElement('tr');

        for (let i: number = 0; i < productKeys.length - 2; i++) {
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
        removeBtn.addEventListener('click', (e: Event) => handleRemoveProductClick(e, product.id));
        tdRemove.appendChild(removeBtn);
        tr.appendChild(tdRemove);

        tbody.appendChild(tr);
    });

    if (tbody.children.length === 0) {
        const td = document.createElement('td');
        td.colSpan = productKeys.length;
        td.textContent = 'No products found';
        td.className = 'text-center text-2xl pt-5'
        tbody.appendChild(td);
    }

    table.appendChild(tbody);
    table.classList.add('table');
    tableWrapperDiv.appendChild(table);
}

function clearTable() : void {
    if (!tableWrapperDiv) return;
    tableWrapperDiv.innerHTML = '';
}
//#endregion