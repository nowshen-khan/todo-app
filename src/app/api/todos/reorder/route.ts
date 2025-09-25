import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order: string[] = Array.isArray(body.order) ? body.order : [];

    const ops = order.map((id, idx) =>
      prisma.todo.update({ where: { id }, data: { order: idx } })
    );

    await prisma.$transaction(ops);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not reorder" }, { status: 500 });
  }
}
