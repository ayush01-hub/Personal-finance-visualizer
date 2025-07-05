import { connectDB } from "@/lib/db";
import {Transaction} from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: any) {
  await connectDB();

  const id = context.params.id; // ✅ No warning
  await Transaction.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}


export async function PUT(req: NextRequest, context: any) {
  await connectDB();

  const id = context.params.id;
  const data = await req.json();

  const updated = await Transaction.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}
