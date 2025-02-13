import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart, Code, Palette, FileText, Linkedin, MessageCircle } from "lucide-react"
import projectsData from "@/data/projects.json"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-24 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left md:w-1/2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in">
                Rizky Syah Gumelar
              </h1>
              <p className="max-w-[700px] text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 animate-fade-in animation-delay-200">
                Data Scientist | Web Developer | UI/UX Designer
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in animation-delay-400">
                <Button asChild>
                  <Link href="#contact">Hire Me</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#projects">View Projects</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/MyCV.pdf" target="_blank">
                    <FileText className="mr-2 h-4 w-4" /> Resume
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in animation-delay-600">
              <Image src="/pic2.png" alt="Rizky Syah Gumelar" width={400} height={400} className="rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Sections */}
      <section id="data-science" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <BarChart className="h-12 w-12 text-primary animate-bounce" />
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Data Science</h2>
            <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
              Transforming raw data into actionable insights using machine learning and statistical analysis.
            </p>
          </div>
        </div>
      </section>

      <section id="web-development" className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Code className="h-12 w-12 text-primary animate-bounce" />
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Web Development</h2>
            <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
              Building responsive and performant web applications using modern frameworks and best practices.
            </p>
          </div>
        </div>
      </section>

      <section id="ui-ux-design" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Palette className="h-12 w-12 text-primary animate-bounce" />
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">UI/UX Design</h2>
            <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
              Crafting intuitive and visually appealing user interfaces to enhance user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                link={project.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8 text-center">Contact Me</h2>
          <div className="mx-auto max-w-[500px] space-y-6">
            <ContactForm />
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Or contact me via:</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href="https://www.linkedin.com/in/rizky-syah-gumelar/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="https://wa.me/+6285186844868" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    <span className="sr-only">WhatsApp</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectCard({
  title,
  description,
  image,
  link,
}: { title: string; description: string; image: string; link: string }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-transform hover:scale-105 flex flex-col h-full">
      <div className="relative h-48 md:h-64">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="rounded-t-lg object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold leading-none tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground flex-grow">{description}</p>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href={link}>
              View Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  return (
    <form action="https://formspree.io/f/mkgovpkq" method="POST" className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your message"
        ></textarea>
      </div>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  )
}

