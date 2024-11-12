import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import AccountForm from "./components/AccountForm";
import AccountsOverview from "./components/AccountsOverview";
import type { Transaction, Account } from "./types";
import DownloadData from "./components/DownloadData";

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
        try {
            const res = await fetch(`${url}/accounts`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setAccounts(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch accounts"));
            setAccounts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        const url = import.meta.env.VITE_API_URL;
        try {
            const res = await fetch(`${url}/transactions`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
            setTransactions([]);
        }
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

    const handleDownloadData = async () => {
        const url = import.meta.env.VITE_API_URL;
        await fetch(`${url}/download-data`)
            .then((res) => res.json())
            .then((data) => {
                // Create a Blob from the JSON data
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                // Create a URL for the Blob
                const downloadUrl = window.URL.createObjectURL(blob);
                // Create a temporary anchor element
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "budget-data.json";
                // Trigger the download
                document.body.appendChild(link);
                link.click();
                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
            });
    };

    const handleUploadData = async () => {
        // Create file input element
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const url = import.meta.env.VITE_API_URL;
                // Read file contents
                const fileContent = await file.text();

                // Send to server
                const response = await fetch(`${url}/upload-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: fileContent,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                // Optional: Handle successful upload
                console.log("File uploaded successfully");

                // Refresh data after upload
                await fetchData();
            } catch (error) {
                console.error("Error uploading file:", error);
                // Handle error appropriately (maybe show to user)
            }
        };

        // Trigger file selection
        input.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center mb-8">
                    <Sprout className="h-8 w-8 text-green-600 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-900">Stupid Simple Budget</h1>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <p className="mt-4 text-gray-600">Loading your budget data...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No data found</h2>
                            <p className="text-gray-600">Get started by uploading your existing budget data.</p>
                        </div>
                        <div className="space-x-4">
                            <button
                                onClick={handleUploadData}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                                Upload Data
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8">
                        <AccountsOverview
                            accounts={accounts}
                            selectedAccountId={selectedAccountId}
                            onSelectAccount={setSelectedAccountId}
                        />
                    </div>
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
                            <DownloadData onDownloadPress={handleDownloadData} onUploadPress={handleUploadData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
