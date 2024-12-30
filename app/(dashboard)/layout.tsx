import { AppSidebar } from "@/components/app-SideBar"
import { ModeToggle } from "@/components/night-mode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getTags } from "@/lib/actions/getTags"


export default async function Layout({ children }: { children: React.ReactNode }) {
  const tags = await getTags();
  return (
    <SidebarProvider>
      <AppSidebar tags={tags}  />
      
      <main className={`w-full h-full `}>
        
        <SidebarTrigger className="p-5 fixed" />
        <div className="p-4 fixed right-0">
        <ModeToggle />
        </div>
        {children}
      </main>
      
    </SidebarProvider>
  )
}
