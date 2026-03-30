import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { seedProductsIfEmpty } from "@/lib/seed-products";
import { ProductModel } from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    await seedProductsIfEmpty();

    const products = await ProductModel.find().sort({ type: 1, name: 1 }).lean();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products." },
      { status: 500 }
    );
  }
}
