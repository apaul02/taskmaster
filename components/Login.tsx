'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ModeToggle } from "./night-mode"
import { CircleCheckBig } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
})

export default function Login() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      })
      if(response?.error) {
        if(response.error.toLowerCase().includes("no user found with this email")) {
          form.setError("email", {
            type: "manual",
            message: "No user found with this email"
          })
        }else if (response.error.toLowerCase().includes("invalid password")) {
          form.setError("password", {
            type: "manual",
            message: "Invalid password"
          })
        }else {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive"
          })
          setOpen(false)
        }
        
        console.log(response)
        console.log(values)
        return;
      }else if (response?.ok) {
        toast({
          title: "Success",
          description: "Successfully signed up"
        })
        setOpen(false);
      }
      
      console.log(response?.status)
      console.log(response)
      console.log(values)
      router.push("/dashboard")
      
    }catch(e) {
      toast({
        title: "Error",
        description: `${e}`,
        variant: "destructive"
      })
      setOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xl sm:text-2xl font-semibold font-montserrat">
              <CircleCheckBig className="h-6 w-6 sm:h-8 sm:w-8 mr-2 cursor-pointer" onClick={() => router.push("/")}/>
              Login
            </div>
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Email</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.email ? "border-red-500" : ""
                      }`} placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Password</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.password ? "border-red-500" : ""
                      }`} type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <Button className="w-full h-10 text-base sm:text-lg" type="submit">Login</Button>
            </form>
          </Form>
          <div className="pt-4 text-center text-sm sm:text-base">
            <Link href="/signup" className="hover:text-primary/80 transition-all duration-300 ease-in-out">
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}