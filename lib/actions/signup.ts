"use server"

import bcrypt from "bcrypt"
import prisma from "../db"

export type SignupResult = {
  message: string;
  error?: string;
};

export async function signup(name: string, email: string, password: string): Promise<SignupResult> {
  try {


    const existingUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (existingUser) {
      console.log("email already taken");
      return {
        message: "email already taken",
        error: "email already taken"
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,

      }
    });


    if (user) {
      console.log("User created");
      return {
        message: "User successfully created",
      };
    }

    return {
      message: "Failed to create user",
      error: "Unknown error occurred"
    };

  } catch (e) {
    console.log(e);
    return {
      message: "Error occurred",
      error: `${e}`
    };
  }
}