import dbConnect from "@/lib/dbConnect";
import InventoryItem from "@/models/InventoryItem";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { sku, quantity, type } = await req.json();

  if (type === "OUT") {
    // Sales or dispatch automatically reduce inventory
    const item = await InventoryItem.findOneAndUpdate(
      { sku: sku },
      { $inc: { currentStock: -Number(quantity) } }, // Decrement logic [cite: 14]
      { new: true }
    );
    if (!item)
      return NextResponse.json({ error: "SKU not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
