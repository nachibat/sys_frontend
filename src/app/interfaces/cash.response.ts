export interface CreateCashResponse {
    ok: boolean;
    cashCreated: Cash;
}

export interface ListCashResponse {
    ok:         boolean;
    total:      number;
    listCashes: Cash[];
}

export interface Cash {
    _id: string;
    cash: number;
    ivc: number;
    uvc: number;
    avc: number;
    kiosk: number;
    tksi: number;
    expenses: number;
    cigarettes: number;
    withdrawals: number;
    createdAt: Date;
    updatedAt: Date;
}