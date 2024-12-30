"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"
import { TagType } from "../types"

export type CreateTaskResult = {
  message: string,
  error?: string
}

export async function createTask(
  title: string,
  description: string,
  done: boolean,
  deadline: Date,
  priority: number,
  tags: TagType[]
): Promise<CreateTaskResult> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user.id) {
      return {
        message: "Unauthenticated request",
        error: "Unauthenticated request"
      }
    }

    const response = await prisma.todo.create({
      data: {
        title,
        description,
        done,
        deadline,
        priority,
        userId: Number(session.user.id),
        tags: {
          connect: tags.map((tag) =>({ name: tag.name }))
        }
      },
      
    })

    if (!response) {
      return {
        message: "Unexpected Error Occurred",
        error: "Unexpected Error"
      }
    }

  

    return {
      message: "Task created Successfully"
    }

  } catch (e) {
    console.error('Task creation error:', e)
    return {
      message: "Error Occurred",
      error: e instanceof Error ? e.message : "Unknown error occurred"
    }
  }
}