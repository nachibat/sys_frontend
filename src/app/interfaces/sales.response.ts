export interface Item {
    barcode: string;
    description: string;
    stock: number;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface SaleResponse {
    ok: boolean;
    saleCreated: SaleCreated;
}

export interface SaleCreated {
    _id: string;
    id_user: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ItemSaleResponse {
    ok: boolean;
    itemCreated: ItemCreated;
}

export interface ItemCreated {
    _id: string;
    id_sale: string;
    barcode: string;
    price: string;
    quantity: number;
}