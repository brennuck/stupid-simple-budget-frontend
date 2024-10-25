import React, { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import type { Transaction, Account } from "../types";

interface TransactionFormProps {
    onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
    selectedAccountId: string;
    accounts: Account[];
}

export default function TransactionForm({ onAddTransaction, selectedAccountId, accounts }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!description || !amount) {
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            onAddTransaction({
                description,
                amount: parseFloat(amount) * (type === "expense" ? -1 : 1),
                date: new Date().toLocaleDateString("en-US"),
                type,
                account_id: selectedAccountId,
            });

            setDescription("");
            setAmount("");
            setIsLoading(false);
        }, 1000); // 1 second delay
    };

    const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

    if (!selectedAccount) return null;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction for {selectedAccount.name}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="mt-1 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-blue-600"
                                name="type"
                                value="expense"
                                checked={type === "expense"}
                                onChange={(e) => setType(e.target.value as "expense")}
                            />
                            <span className="ml-2">Expense</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-green-600"
                                name="type"
                                value="income"
                                checked={type === "income"}
                                onChange={(e) => setType(e.target.value as "income")}
                            />
                            <span className="ml-2">Income</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        placeholder="Enter description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        placeholder="Enter amount"
                        step="0.01"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <PlusCircle className="w-4 h-4 mr-2" />
                    )}
                    Add Transaction
                </button>
            </div>
        </form>
    );
}
