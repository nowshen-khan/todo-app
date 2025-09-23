import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ Task Delete করা
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // ❌ await dorkar nai
  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json(deletedTodo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete todo" }, { status: 500 });
  }
}

// ✅ Task Update করা (complete toggle, pin/unpin, etc.)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ id ekhane ashbe

  try {
    const body = await req.json();

    // allow partial updates
    const data: any = {};
    if (typeof body.text === "string") data.text = body.text.trim();
    if (typeof body.completed === "boolean") data.completed = body.completed;
    if (typeof body.pinned === "boolean") data.pinned = body.pinned;
    if (typeof body.importance === "string") data.importance = body.importance;
    if (typeof body.category === "string") data.category = body.category;
    if (typeof body.order === "number") data.order = body.order;

    const updated = await prisma.todo.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ...updated, _id: updated.id, id: updated.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update todo" }, { status: 500 });
  }
}
