"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { redirect } from "next/navigation";
import prisma from "../db";

export async function deleteTag(id: number) {
  const session = await getServerSession(authOptions);
  if(!session?.user) {
    redirect("/login");
  }

    await prisma.tag.delete({
    where: {
      id: id
    }
  })
}