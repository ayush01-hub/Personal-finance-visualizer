"use client";

import AddTransactionForm from "@/components/AddTransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyChart";
import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Personal Finance Visualizer</h1>

      {/* 👇 These use toggleRefresh */}
      <AddTransactionForm onRefresh={toggleRefresh} />
      <TransactionList refreshTrigger={refresh} onRefresh={toggleRefresh} />

      {/* 👇 Only needs refreshTrigger */}
      <MonthlyChart refreshTrigger={refresh} />
    </main>
  );
}
