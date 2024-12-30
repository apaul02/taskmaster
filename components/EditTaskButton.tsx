"use client";

import { useState } from "react";
import { Flag, PenLine } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTask } from "@/lib/actions/UpdateTodo";
import { Todo } from "@/lib/types";

export const taskSchema = z.object({
  title: z
    .string({
      required_error: "Please Enter a Title",
    })
    .min(1, { message: "Please Enter a title" }),
  description: z
    .string({
      required_error: "Please Enter a Description",
    })
    .min(1, { message: "Please enter a description" }),
  priority: z.number({
    required_error: "Please select a Priority",
  }),
  deadline: z.date({
    required_error: "A date is required",
  }),
});

export function EditTaskButton({ todo, onUpdate }: { todo: Todo; onUpdate: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      deadline: new Date(todo.deadline),
    },
  });

  async function onSubmit(data: z.infer<typeof taskSchema>) {
    const result = await updateTask({
      id: todo.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      deadline: data.deadline,
    });

    if (result.success) {
      toast({
        title: "Task Updated",
        description: "The task was successfully updated",
      });
      setOpen(false);
      onUpdate()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update the task",
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center rounded-lg justify-center space-x-2 border-0 shadow-none hover:bg-transparent hover:scale-110"
          disabled={todo.done}
          variant="outline"
        >
          <PenLine className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xl">Set a deadline</FormLabel>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      initialFocus
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xl">Priority</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(Number(value))
                      }
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1"><Flag color="#ff0000" fill="#ff0000" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="2"><Flag color="#ff530f" fill="#ff530f" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="3"><Flag color="#ffc800" fill="#ffc800" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="4"><Flag color="#04ff00" fill="#04ff00" className="h-5 w-5" /></SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="w-full h-[50px] text-xl" type="submit">
              Update Task
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}