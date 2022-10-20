export interface FundListResponse {
    ok:        boolean;
    total:     number;
    listFunds: Fund[];
}

export interface Fund {
    _id:           string;
    cash_withdraw: number;
    expenses:      number;
    description:   string;
    total:         number;
    createdAt:     Date;
    updatedAt:     Date;
    user?:          User;
}

export interface User {
    username: string;
    role:     string;
}

export interface FundsLastoneResponse {
    ok:      boolean;
    lastone: Lastone;
}

export interface Lastone {
    _id:           string;
    cash_withdraw: number;
    expenses:      number;
    description:   string;
    total:         number;
    id_user:       string;
    createdAt:     Date;
    updatedAt:     Date;
}

export interface FundsCreateResponse {
    ok:          boolean;
    fundCreated: FundCreated;
}

export interface FundCreated {
    cash_withdraw: number;
    expenses:      number;
    description:   string;
    total:         number;
    id_user:       string;
    _id:           string;
    createdAt:     Date;
    updatedAt:     Date;
}