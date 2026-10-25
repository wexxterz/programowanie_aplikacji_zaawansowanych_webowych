export enum Status {
    InStock = 'In Stock',
    Incoming = 'Incoming',
    OutOfStock = 'Out of Stock',
    Discontinued = 'Discontinued',
    Draft = 'Draft'
}

export enum Category {
    CablesAndConnectivity = 'Cables & Connectivity',
    MeasuringTools = 'Measuring Tools',
    SolderingAndTools = 'Soldering & Tools',
    PowerAndChargers = 'Power & Chargers',
    ComponentsAndDIY = 'Components & DIY'
}

export type StorageLocation = {
    sector: string;
    rack: string;
    shelf: string;

}

export type Product = {
    id: number;
    eanCode: string;
    name: string;
    price: number;
    costPrice: number;
    quantity: number;
    category: Category;
    status: Status;
    storageLocation: StorageLocation;
    imageURL: string;
}