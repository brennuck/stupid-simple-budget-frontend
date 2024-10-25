export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: "income" | "expense";
    account_id: string;
    to_account_id?: string;
    from_account_id?: string;
}

export interface Category {
    name: string;
    color: string;
}

export interface Account {
    id: string;
    name: string;
    type: "savings" | "budget" | "allowance" | "retirement" | "stock";
    balance: number;
}
