import { ListTodo, Star, Calendar, BookPlus, CheckCheck, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Roboto } from 'next/font/google'
import { Button } from './ui/button'
import Link from 'next/link'

const roboto = Roboto({ subsets: ['latin'],
  weight: "300"
})

const features = [
  {
    icon: <ListTodo className="w-12 h-12 text-primary" />,
    title: "Task Management",
    description: "Create, edit, and organize your tasks with ease. Add details, due dates.",
    details: [
      "Intuitive task creation interface",
      "Rich text editing for task descriptions",
      "Set due dates and reminders",
      
    ]
  },
  {
    icon: <Star className="w-12 h-12 text-primary" />,
    title: "Priority Setting",
    description: "Assign priorities to your tasks and focus on what matters most. Never miss important deadlines.",
    details: [
      "Multiple priority levels (Low, Medium, High, Urgent)",
      "Color-coded priorities for quick visual reference",
      "Priority-based task sorting",
    ]
  },
  {
    icon: <Calendar className="w-12 h-12 text-primary" />,
    title: "Calendar View",
    description: "Visualize your tasks in a calendar format. Plan your days, weeks, and months efficiently.",
    details: [
      "Monthly, weekly, and daily calendar views",
      "Color-coded events based on task categories or priorities",
      "Agenda view for a list-style overview of scheduled tasks"
    ]
  },
  {
    icon: <BookPlus className="w-12 h-12 text-primary" />,
    title: "Custom Categories",
    description: "Create personalized categories and tags to organize your tasks in a way that makes sense to you.",
    details: [
      "Unlimited custom categories",
      "Tag system for cross-category task grouping",
      "Category-based task filtering and sorting"
    ]
  },
  {
    icon: <CheckCheck className="w-12 h-12 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your productivity with insightful statistics and progress reports.",
    details: [
      "Visual progress bars for projects and goals",
      "Daily, weekly, and monthly productivity reports",
      "Task completion rate analytics",
    ]
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Collaborative Work (Coming Soon)",
    description: "Share and work together towards goals with your friends.",
    details: [
      "Invite team members and collaborators",
      "Real-time task updates and comments",
      "Shared project spaces and task lists",
    ]
  }
]

export  function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className={`text-4xl font-bold text-center mb-12 ${roboto.className}`}>Learn More About Our Features</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-center">{feature.title}</CardTitle>
              <CardDescription className="text-center">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc pl-5 space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button asChild variant={"ghost"} className='hover:scale-110 transition-all hover:bg-transparent'>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

