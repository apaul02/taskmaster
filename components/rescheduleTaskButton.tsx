"use client";

import { useState } from "react";
import { PenLine, Undo2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { rescheduleTodo } from "@/lib/actions/rescheduleTodo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export function RescheduleTaskButton({ todo, onUpdate }: { todo: Todo; onUpdate: () => void }) {
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
    const result = await rescheduleTodo(todo.id, data.deadline);

    if (result.success) {
      toast({
        title: "Task Updated",
        description: "The task was successfully updated",
      });
      setOpen(false);
      onUpdate();
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
          variant="outline"
        >
          <Undo2 className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 sm:p-6 w-auto sm:w-auto sm:max-w-md">
        <DialogHeader className="p-6 pb-2 sm:p-0">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Reschedule Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-6 pt-2 sm:p-0"
          >
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg sm:text-xl mb-2">Set a deadline</FormLabel>
                  <div className="flex justify-center w-full">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      initialFocus
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button className="w-full text-lg sm:text-xl" type="submit">
                Update Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}