import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTodoSchema = z.object({
  text: z.string().optional(),
  completed: z.boolean().optional(),
  pinned: z.boolean().optional(),
  importance: z.enum(["high", "medium", "low"]).optional(),
  category: z.string().optional(),
  order: z.number().optional(),
});

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 
  try {
    const deletedTodo = await prisma.todo.delete({ where: { id } });
    return NextResponse.json(deletedTodo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete todo" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const parsed = updateTodoSchema.parse(body);

    const data: Partial<typeof parsed> = parsed;

    const updated = await prisma.todo.update({ where: { id }, data });

    return NextResponse.json({ ...updated, _id: updated.id, id: updated.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update todo" },
      { status: 500 }
    );
  }
}
