"use server"

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Todo } from "../types";

export async function getTodosByTag(tagName: string): Promise<{
  data: Todo[];
  error: string | null;
}> {
  if (!tagName?.trim()) {
    return {
      data: [],
      error: "Tag name is required"
    };
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      redirect("/login");
    }

    const userId = Number(session.user.id);
    
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId,
        deletedAt: null,
        tags: {
          some: {
            name: {
              equals: tagName,
              mode: 'insensitive'
            }
          }
        }
      },
      orderBy: {
        priority: 'asc'
      }
    });
    console.log("Fetched tags from serve action")

    revalidatePath(`/tags/${encodeURIComponent(tagName)}`);

    return {
      data: todos,
      error: null
    };

  } catch (error) {
    console.error("Error fetching todos by tag:", error);
    
    // Check if it's a Prisma error

    return {
      data: [],
      error: "An unexpected error occurred. Please try again later."
    };
  }
}