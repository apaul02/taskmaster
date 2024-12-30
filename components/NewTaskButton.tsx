import { useState } from "react"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const taskSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  priority: z.string(),
  date: z.date()
})

export function NewTaskButton() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "priority4",
      date: new Date()
    }
  })

  async function onSubmit(data: z.infer<typeof taskSchema>) {
    try {
      console.log(data)
      toast({
        title: "Task created",
        description: "Your new task has been successfully added.",
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your task.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center w-full font-montserrat rounded-lg justify-center space-x-2">
          <PlusCircle className="h-8 w-8" />
          <span>Add New Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] md:max-w-xl" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-montserrat">Add a new task</DialogTitle>
        </DialogHeader>
        <p id="dialog-description" className="sr-only">This dialog allows you to add a new task with a title, description, deadline, and priority.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Title</FormLabel>
                  <FormControl>
                    <Input className="h-10 text-lg" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Description</FormLabel>
                  <FormControl>
                    <Input className="h-10 text-lg" placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xl">Set a deadline</FormLabel>
                    
                    <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= new Date()
                    }
                    initialFocus
                  />
                    <FormMessage className="text-lg" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xl">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 text-md">
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="priority1">Priority 1</SelectItem>
                        <SelectItem value="priority2">Priority 2</SelectItem>
                        <SelectItem value="priority3">Priority 3</SelectItem>
                        <SelectItem value="priority4">Priority 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg" />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full h-[50px] text-xl" type="submit">Add Task</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
