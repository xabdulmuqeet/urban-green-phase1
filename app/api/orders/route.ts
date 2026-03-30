import { NextResponse } from "next/server";
import type { ApiCartItem } from "@/lib/api-types";
import { calculateCartTotal, normalizeAndMergeCartItems } from "@/lib/commerce";
import { requireCurrentUser, getCurrentSessionEmail } from "@/lib/session";
import { createOrderSchema } from "@/lib/validators";
import { OrderModel } from "@/models/Order";
import { isDatabaseConfigured } from "@/lib/mongoose";

export async function GET() {
  try {
    const email = await getCurrentSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to fetch orders." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await OrderModel.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString()
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const email = await getCurrentSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to place orders." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = createOrderSchema.parse(await request.json());
    const sourceItems = (payload.items ?? user.cart ?? []) as ApiCartItem[];

    if (sourceItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const normalizedItems = await normalizeAndMergeCartItems(sourceItems);
    const totalAmount = calculateCartTotal(normalizedItems);

    const order = await OrderModel.create({
      userId: user._id,
      items: normalizedItems,
      totalAmount
    });

    user.cart = [];
    await user.save();

    return NextResponse.json(
      {
        order: {
          id: String(order._id),
          items: order.items,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order." },
      { status: 400 }
    );
  }
}
