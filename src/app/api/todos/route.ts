import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
  select: { id: true, text: true, completed: true, pinned: true, importance: true, category: true },
  orderBy: [
    { pinned: "desc" },
    { importance: "asc" }, // maybe map high=0, medium=1, low=2 in DB
    { createdAt: "asc" }
  ]
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
const { text, category, importance, pinned } = body;
const created = await prisma.todo.create({
data: {
text: String(text ?? "").trim(),
category: category ?? "General",
importance: (importance ?? "medium") as any,
pinned: Boolean(pinned ?? false),
},
});
return NextResponse.json({ ...created, _id: created.id, id: created.id });
}
  

  catch (error) {
   console.error(error);
return NextResponse.json({ error: "Could not create todo" }, { status: 500 });
}
}
