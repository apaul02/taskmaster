

import { SortedTasks } from "@/components/Sortedtasks";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Tasks() {
  
  const session = await getServerSession(authOptions);
  if(!session?.user) {
    redirect("/login")
  }
  return (
    <div>
      <div className="px-8">
        <SortedTasks />
      </div>
    </div>
  )
}