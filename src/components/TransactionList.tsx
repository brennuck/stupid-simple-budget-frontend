import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency } from "./utils";

interface TransactionListProps {
    transactions: Transaction[];
    selectedAccountId?: string;
}

export default function TransactionList({ transactions, selectedAccountId }: TransactionListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    const filteredTransactions = selectedAccountId
        ? transactions.filter(
              (t) =>
                  t.account_id === selectedAccountId ||
                  t.from_account_id === selectedAccountId ||
                  t.to_account_id === selectedAccountId
          )
        : transactions;

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flow-root">
                {currentTransactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No transactions yet</p>
                ) : (
                    <ul role="list" className="divide-y divide-gray-200">
                        {currentTransactions.map((transaction) => (
                            <li key={transaction.id} className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {transaction.type === "expense" || transaction.from_account_id !== null ? (
                                            <ArrowDownCircle className="h-6 w-6 text-red-500" />
                                        ) : (
                                            <ArrowUpCircle className="h-6 w-6 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {transaction.description}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {new Date(transaction.date).toLocaleDateString("en-US")}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.type === "expense" || transaction.from_account_id !== null
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {formatCurrency(transaction.amount || 0)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex justify-between px-6 py-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="text-blue-500 disabled:text-gray-400"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="text-blue-500 disabled:text-gray-400"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}
