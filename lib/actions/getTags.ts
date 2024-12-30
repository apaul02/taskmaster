"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "../db";
import { redirect } from "next/navigation";

export async function getTags() {
  const session = await getServerSession(authOptions);
  if(!session?.user) {
    redirect("/login")
  }
  const tags = await prisma.tag.findMany({
    where: {
      userId: Number(session?.user.id)
    }
  })
  return tags || [];
}