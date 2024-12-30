'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import prisma from '../db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Todo } from '../types'


export async function getTodos(): Promise<{data: Todo[]; error: string | null}> {
  try {
    const sesion = await getServerSession(authOptions);
  if(!sesion?.user.id || !sesion) {
    redirect("/login")
  }
  const response =  await prisma.todo.findMany({
    where: {
      userId : Number(sesion.user.id),
      deletedAt: null
    },
    orderBy: {
      priority: "asc"
    }
  })

  revalidatePath("/tasks")

  return {
    data: response,
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


