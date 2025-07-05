'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AddTransactionFormProps = {
    onRefresh: () => void;
};

const schema = z.object({
    amount: z.preprocess(
        (val) => Number(val),
        z.number({ required_error: "Amount is required", invalid_type_error: "Amount must be a number" }).positive("Amount must be a positive number")
    ),
    description: z.string().trim().min(1, "Description is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date" }),
});

export default function AddTransactionForm({ onRefresh }: AddTransactionFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
        await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, amount: Number(data.amount) }),
        });

        toast.success("Transaction added!");
        reset();
        onRefresh();
        } catch {
        toast.error("Something went wrong");
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
        >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Add New Transaction</h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4">
            <div className="flex-1">
            <Label htmlFor="amount" className="block mb-1 font-medium text-gray-700">Amount (₹)</Label>
            <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                {...register("amount")}
                className="w-full"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message as string}</p>}
            </div>

            <div className="flex-1">
            <Label htmlFor="date" className="block mb-1 font-medium text-gray-700">Date</Label>
            <Input
                type="date"
                id="date"
                {...register("date")}
                className="w-full"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message as string}</p>}
            </div>
        </div>

        <div>
            <Label htmlFor="description" className="block mb-1 font-medium text-gray-700">Description</Label>
            <Input
            type="text"
            id="description"
            placeholder="Enter description"
            {...register("description")}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>}
        </div>

        <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md py-3 transition-colors duration-300"
            disabled={isSubmitting}
        >
            {isSubmitting ? "Adding..." : "Add Transaction"}
        </Button>
        </form>
    );
}
