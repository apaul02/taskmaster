"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db"

type CreateTagType = {
  message : string,
  success: boolean
}

export async function createTag(tag: string): Promise<CreateTagType> {
  try {
    const session = await getServerSession(authOptions);
    if(!session?.user) {
      return {
        success: false,
        message: "unauthenticated request"
      }
    }
    const existingtag = await prisma.tag.findUnique({
      where: {
        name: tag
      }
    })
    if(existingtag) {
      return {
        success: false,
        message: "This tag already exsists"
      }
    }
    const response = await prisma.tag.create({
      data : {
        name: tag,
        userId: Number(session.user.id)
      }
    })
    if(!response) {
      return {
        success: false,
        message: "error while creating tag"
      }
    }
    return {
      success: true,
      message: "succesfully created the tag"
    }
  }catch(e) {
    return {
      success: false,
      message: `${e}`
    }
  }
}