

import { SignupForm } from "@/components/Signup";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if(session?.user.id) {
    redirect("/dashboard")
  }
  return (
    <SignupForm />
  )
}