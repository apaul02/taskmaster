import Home from "@/components/Landing";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Main() {
  const session = await getServerSession(authOptions);
  if(session?.user || session?.user.id) {
    redirect("/dashboard")
  }
  return (
    <div>
      <Home />
    </div>
  )
}