"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"

type UndoDeleteType = {
  success: boolean,
  message : string
}

export async function undoDelete(id: number): Promise<UndoDeleteType> {
  try {
    const session = await getServerSession(authOptions);
    if(!session?.user) {
      return {
        success : false,
        message: "Unauthenticated request"
      }
    }
    const findTodo = await prisma.todo.findUnique({
      where: {
        id : id
      }
    })
    if(!findTodo) {
      return {
        success: false,
        message: "Todo not found"
      }
    }
    const undoDelete = await prisma.todo.update({
      where: {
        id: findTodo.id
      },
      data: {
        deletedAt: null
      }
    })
    if(!undoDelete) {
      return {
        success: false,
        message: "Error Occured while deleting or creating"
      }
    }
    return {
      success: true,
      message: "Task restored"
    }
  }catch(e) {
    return {
      success: false,
      message: `${e}`
    }
  }
}