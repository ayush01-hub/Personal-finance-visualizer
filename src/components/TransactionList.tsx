'use client';

import { useEffect, useState } from "react";

type Transaction = {
    _id: string;
    amount: number;
    description: string;
    date: string;
};

type TransactionListProps = {
    refreshTrigger: boolean;
    onRefresh: () => void;
};

export default function TransactionList({ refreshTrigger, onRefresh }: TransactionListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ amount: "", description: "", date: "" });

    const fetchTransactions = async () => {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction?")) return;
        await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        onRefresh();
    };

    const handleEdit = (txn: Transaction) => {
        setEditingId(txn._id);
        setForm({
        amount: txn.amount.toString(),
        description: txn.description,
        date: txn.date.slice(0, 10),
        });
    };

    const handleUpdate = async () => {
        if (!form.amount || !form.description || !form.date) return;
        await fetch(`/api/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount: Number(form.amount),
            description: form.description,
            date: form.date,
        }),
        });
        setEditingId(null);
        setForm({ amount: "", description: "", date: "" });
        onRefresh();
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Transactions</h2>

        {transactions.length === 0 && (
            <p className="text-gray-500 text-center text-sm">No transactions found.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
            {transactions.map((tx) => (
            <div
                key={tx._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
                {editingId === tx._id ? (
                <>
                    <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Amount"
                    />
                    <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Description"
                    />
                    <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                    onClick={handleUpdate}
                    className="self-start bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                    Save
                    </button>
                </>
                ) : (
                <>
                    <div>
                    <p className="text-lg font-medium text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                    </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-green-600">₹ {tx.amount}</p>
                    <div className="flex gap-3">
                        <button
                        onClick={() => handleEdit(tx)}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
                        aria-label={`Edit transaction ${tx.description}`}
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-red-600 font-semibold hover:text-red-800 transition-colors duration-300"
                        aria-label={`Delete transaction ${tx.description}`}
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}
