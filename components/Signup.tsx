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
import { signup } from "@/lib/actions/signup"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const signupSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export function SignupForm() {
  const { toast } = useToast();
  const router = useRouter()
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      const response = await signup(values.name, values.email, values.password);
      if(response.error) {
        if (response.error.toLowerCase().includes("email already taken")) {
          form.setError("email", {
            type: "manual",
            message: "This email is already taken. Please use a different email."
          });
        } else {
          toast({
            title: "Error while signing up",
            description: response.error
          })
        }
        return
      }
      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      });

      if (signInResult?.error) {
        toast({
          title: "Error while signing in",
          description: signInResult.error
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully signed up and logged in"
      })
      
      router.push("/dashboard")
    } catch(e) {
      toast({
        title: "Error while Signing up",
        description: `${e}`
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xl sm:text-2xl font-semibold font-montserrat">
              <CircleCheckBig className="h-6 w-6 sm:h-8 sm:w-8 mr-2 cursor-pointer" onClick={() => router.push("/")}/>
              <span className="hidden sm:inline">Create an account</span>
              <span className="sm:hidden">Sign Up</span>
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
                      <Input 
                        className={`h-10 text-sm sm:text-base ${
                          form.formState.errors.email ? "border-red-500" : ""
                        }`} 
                        placeholder="john@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Name</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.name ? "border-red-500" : ""
                      }`} placeholder="John Doe" {...field} />
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
                      }`} type="password" placeholder="Minimum 8 characters" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Confirm Password</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.confirmPassword ? "border-red-500" : ""
                      }`} type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <Button className="w-full h-10 text-base sm:text-lg" type="submit">Sign Up</Button>
            </form>
          </Form>
          <div className="pt-4 text-center text-sm sm:text-base">
            <Link href="/login" className="hover:text-primary/80 transition-all duration-300 ease-in-out">
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}