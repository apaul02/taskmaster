// app/actions/updateTask.ts
"use server";

import prisma from "../db";



export async function updateTask({
  id,
  title,
  description,
  priority,
  deadline,
}: {
  id: number;
  title: string;
  description: string;
  priority: number;
  deadline: Date;
}) {
  try {
    const updatedTask = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        deadline,
      },
    });
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update the task" };
  }
}
