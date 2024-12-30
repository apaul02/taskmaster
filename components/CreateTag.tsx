"use client"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createTag } from "@/lib/actions/createTag";
import { useRouter } from "next/navigation";

const tagSchema = z.object({
  name : z.string().min(1, {message: "Please enter a name"})
})


export function Createtag() {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: ""
    }
  })
  async function onSubmit(values: z.infer<typeof tagSchema>) {
    try {
      const response = await createTag(values.name)
      if(!response.success) {
        if(response.message.toLocaleLowerCase().includes("this tag already exsists")) {
          form.setError("name" ,{
            type: "manual",
            message: "This tag is already created"
          })
        }else {
          toast({
            title: "Error while creating tag",
            variant: "destructive"
          })
        }
        setOpen(false);
        return;
      }
      toast({
        title: "Created",
        description: response.message
      })
      setOpen(false);
      form.reset()
      router.refresh()
    }catch(e) {
      toast({
        title: "Error",
        description: `Error in catch block ${e}`
      })
    }
  }

  return (
    <div className="pt-20">
      <Card className="mx-20">
        <CardHeader>
          <CardTitle>Create Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input className="border-0 border-b rounded-none focus-visible:outline-none focus-visible:ring-0" placeholder="Tag name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button className="w-full sm:w-auto text-lg" type="submit">Create Tag</Button>
              </div>   
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}