import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import AccountForm from "./components/AccountForm";
import AccountsOverview from "./components/AccountsOverview";
import type { Transaction, Account } from "./types";

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
    }, []);

    const fetchData = async () => {
        await fetchAccounts();
        await fetchTransactions();
    };

    const fetchAccounts = async () => {
        const url = import.meta.env.VITE_API_URL;
        await fetch(`${url}/accounts`)
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data);
            });
    };

    const fetchTransactions = async () => {
        const url = import.meta.env.VITE_API_URL;
        await fetch(`${url}/transactions`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            });
    };

    const handleAddTransaction = async (newTransaction: Omit<Transaction, "id">) => {
        const url = import.meta.env.VITE_API_URL;
        const transaction: Transaction = {
            ...newTransaction,
            id: crypto.randomUUID(),
        };
        const response = await fetch(`${url}/transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...transaction,
            }),
        });

        if (!response.ok) {
            return;
        }

        fetchData();
    };

    const handleAddAccount = async (newAccount: Omit<Account, "id" | "balance">) => {
        const url = import.meta.env.VITE_API_URL;
        const account: Account = {
            ...newAccount,
            id: crypto.randomUUID(),
            balance: 0,
        };
        const response = await fetch(`${url}/account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newAccount.name,
                type: newAccount.type,
                balance: 0,
            }),
        });

        if (!response.ok) {
            return;
        }

        fetchData();

        if (!selectedAccountId) {
            setSelectedAccountId(account.id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center mb-8">
                    <Sprout className="h-8 w-8 text-green-600 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-900">Stupid Simple Budget</h1>
                </div>

                {accounts.length > 0 ? (
                    <div className="mb-8">
                        <AccountsOverview
                            accounts={accounts}
                            selectedAccountId={selectedAccountId}
                            onSelectAccount={setSelectedAccountId}
                        />
                    </div>
                ) : (
                    <div className="mb-8">Spinning up database...</div>
                )}

                {accounts.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {accounts.length > 0 && (
                                <>
                                    {selectedAccountId && (
                                        <Summary transactions={transactions} selectedAccountId={selectedAccountId} />
                                    )}
                                    <TransactionList
                                        transactions={transactions}
                                        selectedAccountId={selectedAccountId}
                                    />
                                </>
                            )}
                        </div>

                        <div className="space-y-6">
                            {selectedAccountId && (
                                <TransactionForm
                                    onAddTransaction={handleAddTransaction}
                                    selectedAccountId={selectedAccountId}
                                    accounts={accounts}
                                />
                            )}
                            <AccountForm onAddAccount={handleAddAccount} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
