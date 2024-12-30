"use client"
import { Calendar, LayoutDashboard, ListTodo, CirclePlus, Tag, User2, ChevronUp, LogOutIcon, Plus, Hash, Trash } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react" 
import { deleteTag } from '@/lib/actions/deleteTag'
import { TagType } from '@/lib/types'

// Menu items.
const items = [
  {
    title: "Create Task",
    url: "/create/task",
    icon: CirclePlus
  },
  {
    title: "Create Tags",
    url: "/create/tag",
    icon: Tag
  },
  // {
  //   title: "Create Notes",
  //   url: "/create/note",
  //   icon: Pen
  // },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  // {
  //   title: "Notes",
  //   url: "/notes",
  //   icon: NotebookPen,
  // },
]



export function AppSidebar({ tags }: { tags: TagType[] }) {
  const session = useSession();
  const router = useRouter();
  
  const handleAddTag = () => {
    router.push("/create/tag")
  }

  const handleDeleteTag = (tagId: number) => {
    deleteTag(tagId);
    router.push("/dashboard")
    console.log(`Delete tag with id: ${tagId}`)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-10 w-10" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarGroupAction title="Add Tag" onClick={handleAddTag}>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
            {tags.map((tag) => (
              <SidebarMenuItem key={tag.name}>
                <SidebarMenuButton asChild>
                  <a href={`/tags/${tag.name}`}>
                    <Hash />
                    <span>{tag.name}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuAction onClick={() => handleDeleteTag(tag.id)} title={`Delete ${tag.name}`}>
                  <Trash size={16} strokeWidth={1} />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="" asChild>
              <div className=""onClick={() => router.push("https://github.com/apaul02/taskmaster")}>
                <GitHubLogoIcon  />
                Github
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session.data?.user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <User2 className="h-4 w-4 mr-2" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="align-middle" onClick={async () => await signOut()}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

