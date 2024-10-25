import React from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency } from "./utils";

interface SummaryProps {
    transactions: Transaction[];
    selectedAccountId: string;
}

export default function Summary({ transactions, selectedAccountId }: SummaryProps) {
    const accountTransactions = transactions.filter(
        (t) =>
            t.account_id === selectedAccountId ||
            t.to_account_id === selectedAccountId ||
            t.from_account_id === selectedAccountId
    );

    const income = accountTransactions
        .filter((t) => t.type === "income" || t.to_account_id !== null)
        .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

    const expenses = accountTransactions
        .filter((t) => t.type === "expense" || t.from_account_id !== null)
        .reduce((sum, t) => Number(sum) + Number(Math.abs(t.amount)), 0);

    const balance = income - expenses;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Income</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(income || 0)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Expenses</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(expenses || 0)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Balance</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(balance || 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
