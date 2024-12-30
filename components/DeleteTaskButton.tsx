"use client"

import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { deleteTodo } from "@/lib/actions/deleteTodo"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { undoDelete } from "@/lib/actions/undoDelete"
import { Todo } from "@/lib/types"

type DeletedTodoResponse = {
  success: boolean,
  message : string,
  todo?: Todo
}

export function DeleteTaskButton( { id, onUpdate } : {id : number; onUpdate: () => void } ) {
  const { toast } = useToast();
  async function onDelete(id : number) {
    
    const response: DeletedTodoResponse = await deleteTodo(id);
    if(response.success && response.todo?.id){
      console.log("In the if statement");
      toast({
        title: "Task Deleted",
        description: response.message,
        action: (
          <ToastAction
            altText="undo"
            onClick={async () => {
              const undoResponse = await undoDelete(response.todo!.id)
              if(undoResponse.success) {
                onUpdate()
              }
            }}
            >
              Undo
            </ToastAction>
        )
      })
      console.log("before update")
      onUpdate()
      console.log("After update");
    }else {
      toast({
        title: "error",
        description: response.message
      })
    }
  }
  return ( 
  <Button onClick={async () => await onDelete(id)} className="border-0 shadow-none hover:bg-transparent hover:scale-110 " variant={"ghost"}>
    <Trash className="h-8 w-8" color="#ff0000" />
  </Button>
  )
}