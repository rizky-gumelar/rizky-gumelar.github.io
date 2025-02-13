"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col md:flex-row h-14 md:h-auto items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 py-6 whitespace-nowrap flex-shrink-0">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="font-bold">Rizky Gumelar</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav
            className={`${isMenuOpen ? "flex" : "hidden"
              } md:flex absolute md:relative top-14 md:top-0 left-0 right-0 flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-6 bg-background md:bg-transparent p-4 md:py-2 w-full text-sm font-medium ml-auto`}
          >
            <Link href="#data-science">Skills</Link>
            {/* <Link href="#web-development">Web Development</Link>
            <Link href="#ui-ux-design">UI/UX Design</Link> */}
            <Link href="#projects">Projects</Link>
            <Link href="#contact">Contact</Link>
            <Button asChild className="w-full md:w-auto">
              <Link href="#contact">Hire Me</Link>
            </Button>
          </nav>
          <ThemeToggle />
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  )
}

