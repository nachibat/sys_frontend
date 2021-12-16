export interface ProductResponse {
    ok: boolean;
    productCreated: Product;
}

export interface ProductModifiedResponse {
    ok: boolean;
    productModified: Product;
}

export interface ProductDeletedResponse {
    ok: boolean;
    message: string;
}

export interface ProductListResponse {
    ok:           boolean;
    total:        number;
    listProducts: Product[];
}

export interface Product {
    _id: string;
    barcode: string;
    description: string;
    category: string;
    quantity: number;
    cost_price: number;
    percent_profit: number;
    price: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}