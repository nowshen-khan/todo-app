import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const todoSchema = z.object({
  text: z.string().min(1),
  category: z.string().optional(),
  importance: z.enum(["high", "medium", "low"]).default("medium"),
  pinned: z.boolean().optional(),
});

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      select: { id: true, text: true, completed: true, pinned: true, importance: true, category: true },
      orderBy: [
        { pinned: "desc" },
        { importance: "asc" },
        { createdAt: "asc" }
      ],
    });
    const shaped = todos.map((t) => ({ ...t, _id: t.id, id: t.id }));
    return NextResponse.json(shaped);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not fetch todos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = todoSchema.parse(body);

    const created = await prisma.todo.create({
      data: {
        text: parsed.text.trim(),
        category: parsed.category ?? "General",
        importance: parsed.importance,
        pinned: parsed.pinned ?? false,
      },
    });

    return NextResponse.json({ ...created, _id: created.id, id: created.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create todo" }, { status: 500 });
  }
}
