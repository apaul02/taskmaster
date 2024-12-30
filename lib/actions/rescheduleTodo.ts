"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { redirect } from "next/navigation";
import prisma from "../db";

type RescheduleTodoResponse = {
  success: boolean,
  message: string
}

export async function rescheduleTodo(id: number, date: Date): Promise<RescheduleTodoResponse> {
   try{
    const session = await getServerSession(authOptions);
    if(!session?.user) {
      redirect("/login");
    }
    const todo = await prisma.todo.findUnique({
      where: {
        id : Number(id)
      }
    })
    if(!todo) {
      return {
        success: false,
        message: "Todo not found"
      }
    }
    const response = await prisma.todo.update({
      where: {
        id: Number(id)
      },
      data: {
        deadline: date
      }
    })

    if(!response) {
      return {
        success: false,
        message: "Unable to update task"
      }
    }

    return {
      success: true,
      message: "New deadline set"
    }
  } catch(e) {
    return {
      success: false,
      message : `Unknown error occured ${e}`
    }
  }
}