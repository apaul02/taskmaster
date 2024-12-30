"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "../db";
import bcrypt from "bcrypt";

export async function updateProfile(
  name: string, 
  email: string, 
  oldPassword: string, 
  newPassword: string
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return {
        success: false,
        message: "Not authenticated"
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id)
      }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    const passwordValidation = await bcrypt.compare(oldPassword, user.password);
    if (!passwordValidation) {
      return {
        success: false,
        message: "Passwords did not match"
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: Number(session.user.id)
        }
      }
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already in use"
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(session.user.id)
      },
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "Failed to update profile"
      };
    }

    

    return {
      success: true,
      message: "Successfully updated account details"
    };
    
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred"
    };
  }
}