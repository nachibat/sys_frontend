export interface ProductResponse {
    ok:             boolean;
    productCreated: Product;
}

export interface Product {
    _id:            string;
    barcode:        string;
    description:    string;
    category:       string;
    quantity:       number;
    cost_price:     number;
    percent_profit: number;
    price:          number;
    createdAt:      Date;
    updatedAt:      Date;
}