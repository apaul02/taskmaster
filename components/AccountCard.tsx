"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Session } from "next-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { updateProfile } from "@/lib/actions/UpdateProfile";
import { useRouter } from "next/navigation";

const updateProfileSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email"
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  oldPassword: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }),
  newPassword: z.string().min(8, {
    message: "New password must be at least 8 characters"
  })
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export function UpdateProfile({ session }: { session: Session }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: session.user?.email || "",
      name: session.user?.name || "",
      oldPassword: "",
      newPassword: ""
    }
  });

  async function onSubmit(values: UpdateProfileFormData) {
    try {
      setIsLoading(true);
      const response = await updateProfile(values.name, values.email, values.oldPassword, values.newPassword);
      
      if (!response.success) {
        if (response.message.toLowerCase().includes("passwords did not match")) {
          form.setError("oldPassword", {
            type: "manual",
            message: "The old password is incorrect"
          });
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive"
          });
        }
        return;
      }
      toast({
        title: "Success",
        description: "Successfully updated account details"
      });
      
      form.reset({
        ...values,
        oldPassword: "",
        newPassword: ""
      });

      
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Profile</CardTitle>
        <CardDescription>Update your account details</CardDescription>
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
                      type="email"
                      className="h-10 text-sm sm:text-base"
                      placeholder="john@example.com" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <Input 
                      className="h-10 text-sm sm:text-base"
                      placeholder="John Doe" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>     
              )}
            />
            <FormField 
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg">Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      className="h-10 text-sm sm:text-base"
                      placeholder="Enter current password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg">New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      className="h-10 text-sm sm:text-base"
                      placeholder="Enter new password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full h-10 text-base sm:text-lg" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}