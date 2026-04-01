import { NextResponse } from "next/server";
import { requireCurrentUser, getCurrentSessionEmail } from "@/lib/session";
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

    await OrderModel.updateMany(
      {
        customerEmail: user.email,
        $or: [{ userId: { $exists: false } }, { userId: null }]
      },
      { $set: { userId: user._id } }
    );

    const orders = await OrderModel.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        deliveryAddress: order.deliveryAddress,
        destinationPostalCode: order.destinationPostalCode,
        shippingType: order.shippingType,
        shippingCost: order.shippingCost,
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
  void request;
  return NextResponse.json(
    { error: "Direct order creation is disabled. Use Stripe checkout to place orders." },
    { status: 405 }
  );
}
