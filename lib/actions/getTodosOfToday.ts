"use server"

import { getServerSession } from "next-auth"
import prisma from "../db"
import { authOptions } from "../auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Todo } from "../types"

export async function getTodosOfToday(): Promise<{ data: Todo[]; error: string | null }> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      redirect("/login")
    }

    const userId = session.user.id
    const now = new Date()
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    )

    const todos = await prisma.todo.findMany({
      where: {
        userId: Number(userId),
        deadline: {
          gte: startOfDay,
          lte: endOfDay
        },
        deletedAt: null
      },
      orderBy: {
        priority: 'asc'
      }
    })

    revalidatePath("/dashboard")  
    
    return {
      data: todos,
      error: null
    }

  } catch (error) {
    console.error("Error in getTodosOfToday:", error)
    
    return {
      data: [],
      error: "Failed to fetch todos. Please try again later."
    }
  }
}