"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"

type UndoToggleType = {
  sucess: boolean,
  message: string
}

export async function undoToggle(id: number): Promise<UndoToggleType> {
  try {
    const session = await getServerSession(authOptions);
    if(!session?.user) {
      return {
        sucess: false,
        message: "Unauthenticated request"
      }
    }
    const findTodo = await prisma.todo.findUnique({
      where : {
        id : id
      }
    })
    if(!findTodo) {
      return {
        sucess: false,
        message: "Unable find the todo"
      }
    }
    const updateTodo = await prisma.todo.update({
      where: {
        id : id
      },
      data : {
        done : !findTodo.done
      }
    })
    if(!updateTodo) {
      return {
        sucess: false,
        message: "Unable to updated todo"
      }
    }
    return {
      sucess: true,
      message: "Todo successfully reverted"
    }
  }catch(e) {
    return {
      sucess: false,
      message: `Unexpected error occured ${e}`
    }
  }
}