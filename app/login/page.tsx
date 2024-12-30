import Login from "@/components/Login";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if(session?.user.id) {
    redirect("/dashboard")
  }
  return (
    <div>
      <Login />
    </div>
  )
}