"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export function LearnMoreButton() {
  const router = useRouter()
  return (
    <Button onClick={() => router.push("/features")} variant={"outline"} className="p-4 py-6 px-5 text-lg transition-all hover:scale-110">Learn More</Button>
  )
}