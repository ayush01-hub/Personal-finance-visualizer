'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    } from 'recharts';

    type Transaction = {
    amount: number;
    date: string;
    };

    type ChartData = {
    month: string;
    total: number;
    };

    type Props = {
    refreshTrigger: boolean;
    };

    function formatMonth(monthKey: string) {
    const [year, month] = monthKey.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. "Jan 2024"
    }

    export default function MonthlyChart({ refreshTrigger }: Props) {
    const [data, setData] = useState<ChartData[]>([]);

    const fetchTransactions = async () => {
        const res = await fetch('/api/transactions');
        const transactions: Transaction[] = await res.json();

        const monthlyMap: Record<string, number> = {};

        transactions.forEach((txn) => {
        const dateObj = new Date(txn.date);
        if (!isNaN(dateObj.getTime())) {
            const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap[key] = (monthlyMap[key] || 0) + txn.amount;
        }
        });

        const chartData = Object.entries(monthlyMap)
        .map(([month, total]) => ({ month: formatMonth(month), total }))
        .sort((a, b) => a.month.localeCompare(b.month));

        setData(chartData);
    };

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Monthly Expenses</h2>
            {data.length === 0 ? (
            <p className="text-gray-500 text-center">No data available.</p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip />
                <Bar dataKey="total" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            )}
        </div>
        </div>
    );
}
