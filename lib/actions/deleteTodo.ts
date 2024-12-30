"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"
import { Todo } from "../types"


type DeleteTodoType = {
  success : boolean,
  message : string,
  todo?: Todo
}

export async function deleteTodo(id :number): Promise<DeleteTodoType> {
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
        id : id
      }
    })
    if(!findTodo) {
      return {
        success: false,
        message: "Task not found"
      }
    }
    const deleteTodo = await prisma.todo.update({
      where: {
        id: id
      },
      data: {
        deletedAt: new Date()
      }
    })
    if(!deleteTodo) {
      return {
        success: false,
        message: "Unknown Error Occured"
      }
    }
    console.log("Deleted from server action");
    return {
      success: true,
      message: "Task Deleted successfully",
      todo: deleteTodo
    }
  }catch(e) {
    return {
      success: false, message: `Error Occured ${e}`
    }
  }
}