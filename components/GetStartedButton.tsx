"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export function GetStartedButton() {
  const router = useRouter()
  return (
    <Button onClick={() => router.push('/login')} className=" py-6 px-5 text-lg transition ease-in hover:scale-110 hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:animate-gradientCycle hover:text-white">Get Started</Button>
  )
}