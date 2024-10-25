import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Account } from '../types';

interface AccountFormProps {
  onAddAccount: (account: Omit<Account, 'id' | 'balance'>) => void;
}

export default function AccountForm({ onAddAccount }: AccountFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Account['type']>('savings');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddAccount({
      name,
      type,
    });

    setName('');
    setType('savings');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Account</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="e.g., Savings Account 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Account Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Account['type'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="savings">Savings</option>
            <option value="budget">Budget</option>
            <option value="allowance">Allowance</option>
            <option value="retirement">Retirement</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Account
        </button>
      </div>
    </form>
  );
}