export interface SupplierListResponse {
    ok: boolean;
    total: number;
    listSuppliers: Supplier[];
}

export interface CreateSupplierResponse {
    ok: boolean;
    supplierCreated: Supplier;
}

export interface ModifySupplierResponse {
    ok: boolean;
    supplierModified: Supplier;
}

export interface Supplier {
    _id: string;
    name: string;
    address: string;
    phone: string;
    mail?: string;
}

export interface DeleteSupplierResponse {
    ok: boolean;
    message: string;
}
