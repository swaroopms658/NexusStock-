import dbConnect from "@/lib/dbConnect";
import InventoryItem from "@/models/InventoryItem";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const items = await InventoryItem.find({});
  return NextResponse.json(items);
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Point 11: Purchases or "Stock-In" must update the inventory centrally
    const item = await InventoryItem.findOneAndUpdate(
      { sku: data.sku },
      {
        name: data.name,
        $inc: { currentStock: Number(data.currentStock) }, // Adds to current count
        lowStockThreshold: Number(data.lowStockThreshold || 10),
      },
      { upsert: true, new: true } // Creates the product if the SKU is new
    );

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get("sku");

    if (!sku) {
      return NextResponse.json({ error: "SKU is required" }, { status: 400 });
    }

    await InventoryItem.findOneAndDelete({ sku });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
