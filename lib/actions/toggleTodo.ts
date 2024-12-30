"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"

type ToggleTodoType = {
  success : boolean,
  message : string
}

export async function toggleTodo(id: number): Promise<ToggleTodoType>{
  try {
    const session = await getServerSession(authOptions);
    if(!session?.user) {
      return {
        success: false,
        message: "Unauthenticated request"
      }
    }
    const findTodo = await prisma.todo.findUnique({
      where: {
        id: id
      }
    })
    if(!findTodo) {
      return {
        success: false,
        message: "Unable to find Todo"
      }
    }
    const updateTodo = await prisma.todo.update({
      where: {
        id: id
      },
      data: {
        done: true
      }
    })
    if(!updateTodo) {
      return {
        success: false,
        message: "Unable to update the todo"
      }
    }
    return {
      success: true,
      message: "Successfully updated"
    }
  }catch(e) {
    return {
      success: false,
      message: `Unknown error occured ${e}`
    }
  }
}