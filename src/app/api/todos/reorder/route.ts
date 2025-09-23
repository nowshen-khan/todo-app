import { NextRequest, NextResponse } from "next/server";
import { prisma as prismaClient } from "@/lib/prisma";


export async function POST(req: NextRequest) {
try {
const body = await req.json();
const order: string[] = Array.isArray(body.order) ? body.order : [];


// perform updates in a transaction: set 'order' field according to index
const ops = order.map((id, idx) =>
prismaClient.todo.update({ where: { id }, data: { order: idx } })
);


await prismaClient.$transaction(ops);
return NextResponse.json({ success: true });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Could not reorder" }, { status: 500 });
}
}