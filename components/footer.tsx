import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">&copy; {currentYear} Rizky Syah Gumelar. Built with Next.js and Tailwind CSS.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="https://github.com/rizky-gumelar" target="_blank" rel="noopener noreferrer" className="text-sm">
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/rizky-syah-gumelar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            LinkedIn
          </Link>
          <Link href="https://Instagram.com/rizkysyahg" target="_blank" rel="noopener noreferrer" className="text-sm">
            Instagram
          </Link>
        </div>
      </div>
    </footer>
  )
}

