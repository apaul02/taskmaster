
import { Dashboard } from "@/components/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function() {
  
  const session = await getServerSession(authOptions);
  if(!session?.user) {
    redirect("/login")
  }
  return (
    <div>
      <main className="p-10">
        <Dashboard />
      </main>
    </div>
  )
}