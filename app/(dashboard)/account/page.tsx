import { UpdateProfile } from "@/components/AccountCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if(!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdateProfile session={session} />
      </div>
    </div>
  )
}