"use client"

import { useState } from "react"
import { CircleCheckBig, Github, Menu } from "lucide-react"
import { ModeToggle } from "./night-mode"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { GetStartedButton } from "./GetStartedButton"
import { useRouter } from "next/navigation"

export function Appbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter();

  return (
    <div className="px-4 sm:px-6 h-16 py-3 animate-slideIn fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="pr-3">
            <CircleCheckBig className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold font-montserrat">
            Task Master
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center gap-4 lg:gap-8 text-base items-center">
          <Button variant="outline" size="icon" className="w-9 h-9 rounded-full" onClick={() => router.push("https://github.com/apaul02/taskmaster")}>
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Button>
          <div className="font-medium hidden lg:block">|</div>
          <GetStartedButton />
          <div className="font-medium hidden lg:block">|</div>
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <ModeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  {/* <Github className="mr-2 h-4 w-4" /> */}
                  GitHub
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  Features
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}