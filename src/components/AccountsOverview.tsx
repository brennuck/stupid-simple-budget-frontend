import { Wallet, CreditCard, PiggyBank, LineChart, Palmtree, Folder } from "lucide-react";
import type { Account } from "../types";
import { formatCurrency } from "./utils";

interface AccountsOverviewProps {
    accounts: Account[];
    selectedAccountId: string;
    onSelectAccount: (accountId: string) => void;
}

const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
        case "savings":
            return <PiggyBank className="h-5 w-5" />;
        case "budget":
            return <Wallet className="h-5 w-5" />;
        case "allowance":
            return <CreditCard className="h-5 w-5" />;
        case "retirement":
            return <Palmtree className="h-5 w-5" />;
        case "stock":
            return <LineChart className="h-5 w-5" />;
        default:
            return <Folder className="h-5 w-5" />;
    }
};

export default function AccountsOverview({ accounts, selectedAccountId, onSelectAccount }: AccountsOverviewProps) {
    const totalBalance = accounts
        .filter((account) => ["savings", "retirement", "stock"].includes(account.type))
        .reduce((sum, account) => Number(sum) + Number(account.balance), 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Accounts Overview</h2>
                <div className="text-sm text-gray-500">
                    Total Balance: <span className="font-semibold text-gray-900">{formatCurrency(totalBalance)}</span>
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                    <button
                        key={account.id}
                        className={`flex items-center p-4 rounded-lg transition-colors ${
                            selectedAccountId === account.id
                                ? "bg-green-100 border-green-200"
                                : "bg-gray-50 border-gray-100 hover:border-green-500"
                        }`}
                        onClick={() => onSelectAccount(account.id)}
                    >
                        <div
                            className={`p-2 rounded-lg mr-3 ${
                                account.balance >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                        >
                            {getAccountIcon(account.type)}
                        </div>
                        <div className="flex-1" style={{ textAlign: "left" }}>
                            <h3 className="font-medium text-gray-900">{account.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                        </div>
                        <div className={`text-right ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            <p className="font-semibold">{formatCurrency(account.balance)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
