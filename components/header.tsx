"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex md:flex-row h-14 md:h-auto items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 py-6">
          {mounted && <Image src={theme === "dark" ? "/logo-dark.png" : "/logo.png"} alt="Logo" width={32} height={32} />}
          <span className="font-bold">Rizky Gumelar</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav
            className={`${isMenuOpen ? "flex" : "hidden"
              } md:flex absolute md:relative top-14 md:top-0 left-0 right-0 flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-6 bg-background md:bg-transparent p-4 md:py-2 w-full text-sm font-medium ml-auto`}
          >
            <Link href="#skills">Skills</Link>
            <Link href="#projects">Projects</Link>
            <Link href="#contact">Contact</Link>
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

