export interface Item {
    id_product: string;
    barcode: string;
    description: string;
    stock: number;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface SaleResponse {
    ok: boolean;
    saleCreated: Sale;
}

export interface Sale {
    _id: string;
    id_user: User;
    total: number;
    payment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    _id: string,
    username: string,
    role: string
}

export interface ItemSaleResponse {
    ok: boolean;
    itemCreated: SaleItem;
}

export interface SaleItem {
    _id: string;
    id_sale: string;
    id_product: string;
    price: number;
    quantity: number;
}

export interface SaleListResponse {
    ok: boolean;
    total: number;
    listSales: Sale[];
}

export interface SaleItemListResponse {
    ok: boolean;
    listItems: ListItem[];
}

export interface ListItem {
    _id: string;
    id_sale: string;
    product: Product;
    price: number;
    quantity: number;
}

export interface Product {
    _id: string;
    barcode: string;
    description: string;
}
