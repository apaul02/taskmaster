import { FeaturesPage } from "@/components/FeaturesPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Features () {
  const session = await getServerSession(authOptions);
  if(session?.user || session?.user.id) {
    redirect("/dashboard")
  }
  return (
    <FeaturesPage />
  )
}