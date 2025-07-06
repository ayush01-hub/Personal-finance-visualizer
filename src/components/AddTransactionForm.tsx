'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// ✅ Treat amount as string (for safe parsing)
const schema = z.object({
    amount: z.string().min(1, "Amount is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof schema>;

type AddTransactionFormProps = {
    onRefresh: () => void;
};

export default function AddTransactionForm({ onRefresh }: AddTransactionFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const amountNumber = Number(data.amount);

        if (isNaN(amountNumber) || amountNumber <= 0) {
        toast.error("Amount must be a positive number");
        return;
        }

        try {
        await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            ...data,
            amount: amountNumber,
            }),
        });

        toast.success("Transaction Added!");
        reset();
        onRefresh();
        } catch (error) {
            console.error("Add transaction error:", error);
            toast.error("Error adding transaction!");
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded-lg max-w-md mx-auto"
        >
        <div>
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" id="amount" {...register("amount")} />
            {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <Input type="text" id="description" {...register("description")} />
            {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
        </div>

        <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" {...register("date")} />
            {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Transaction"}
        </Button>
        </form>
    );
}
