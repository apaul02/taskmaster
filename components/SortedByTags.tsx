"use client"

import { useEffect, useState } from "react"
import { formatDate } from "./Sortedtasks"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { getPriorityFlag } from "./Dashboard";
import { EditTaskButton } from "./EditTaskButton"
import { DeleteTaskButton } from "./DeleteTaskButton"
import { toggleTodo } from "@/lib/actions/toggleTodo"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { undoToggle } from "@/lib/actions/undoToggle"
import { getTodosByTag } from "@/lib/actions/getTodosByTag"
import { RescheduleTaskButton } from "./rescheduleTaskButton"
import { Todo } from "@/lib/types"
import { Roboto } from "next/font/google"
const roboto = Roboto({subsets: ['latin'],
  weight: "300"
})



export function SortedByTags({ tagName }: { tagName: string}) {
  const [todos, setTodos] = useState<Todo[]>([])
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTodosByTag(tagName);
      if(response.error){
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
        setTodos([]);
        }else {
          setTodos(response.data);
          console.log("fn run")
        }
      }catch(error) {
        console.error("Error while fetchting todos: ", error);
        setError('Failed to load tasks. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive"
        });
      }finally {
        setIsLoading(false);
      }
      
  }

  useEffect(() => {
    fetchTodos()
    console.log("Fetched the first time")
  }, [] )

  async function handleToggle(id: number) {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, done: !todoToUpdate.done };

    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? updatedTodo : todo
      )
    );

    try {
      const response = await toggleTodo(id);
      if(response.success) {
        toast({
          title: "Todo updated",
          description: response.message,
          action: (
            <ToastAction
              altText="undo"
              onClick={async () => {
                setTodos(prevTodos => 
                  prevTodos.map(todo => 
                    todo.id === id ? { ...todo, done: !todo.done } : todo
                  )
                );

                try {
                  const undoResponse = await undoToggle(id);
                  if (!undoResponse.sucess) {
                    setTodos(prevTodos => 
                      prevTodos.map(todo => 
                        todo.id === id ? { ...todo, done: !todo.done } : todo
                      )
                    );
                    toast({
                      title: "Error",
                      description: "Failed to undo action",
                      variant: "destructive"
                    });
                  }
                } catch (error) {
                  setTodos(prevTodos => 
                    prevTodos.map(todo => 
                      todo.id === id ? { ...todo, done: !todo.done } : todo
                    )
                  );
                  toast({
                    title: "Error",
                    description: "Failed to undo action",
                    variant: "destructive"
                  });
                }
              }}>
                Undo
            </ToastAction>
          )
        });
      } else {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === id ? { ...todo, done: !todo.done } : todo
          )
        );
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
      console.error('Error toggling todo:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
    }
  }
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-semibold pb-2 pt-4 font-montserrat w-full text-center">
          Welcome back
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-xl text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-semibold pb-2 font-montserrat w-full text-center">
          Welcome back
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl text-red-500">{error}</p>
          <button 
            onClick={fetchTodos}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeTodos = todos.filter(todo => !todo.done);
  
  if (todos.length === 0 || activeTodos.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${roboto.className}`}>
        <h1 className="text-5xl md:text-7xl font-extrabold text-center">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            No tasks
          </span>
          <span className="block mt-2 text-4xl md:text-6xl text-gray-600">
            for today
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">Enjoy your free time!</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-center">
        <div className="text-2xl font-semibold py-5">
          {tagName}
        </div>
      </div>
      <div className="space-y-4 mx-10 pt-2">
      {todos.sort((a, b) => {
          const today = new Date().setHours(0, 0, 0, 0);
          const aIsPast = new Date(a.deadline).setHours(0, 0, 0, 0) < today;
          const bIsPast = new Date(b.deadline).setHours(0, 0, 0, 0) < today;

          if (aIsPast && !bIsPast) return -1; 
          if (!aIsPast && bIsPast) return 1; 
          return a.priority - b.priority;
        })
        .map((todo) => (
          <Card
            key={todo.id}
            className={`transition-all duration-500 ease-linear ${
              todo.done ? 'hidden' : 'opacity-100 h-auto'
            }`}
          >
            <div className="flex justify-between">
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="flex flex-col gap-3">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    className="mt-2 rounded-full"
                    checked={todo.done}
                    onCheckedChange={async () => await handleToggle(todo.id)}
                  />
                  <div>
                    {getPriorityFlag(todo.priority)}
                  </div>
                </div>
                <div>
                  <CardTitle
                    className={`text-lg ${
                      new Date(todo.deadline).setHours(0, 0, 0, 0) <
                      new Date().setHours(0, 0, 0, 0)
                        ? 'text-red-500'
                        : ''
                    }`}
                  >
                    {todo.title}
                  </CardTitle>
                  <CardDescription>
                    {todo.description}
                  </CardDescription>
                  <CardDescription>
                    {formatDate(todo.deadline)}
                  </CardDescription>
                </div>
              </CardContent>
              <div className="flex justify-center pt-3">
                <div
                  className={`${
                    new Date(todo.deadline).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0)
                      ? ''
                      : 'hidden'
                  }`}
                >
                  <RescheduleTaskButton todo={todo} onUpdate={fetchTodos} />
                </div>
                <EditTaskButton todo={todo} onUpdate={fetchTodos} />
                <DeleteTaskButton id={todo.id} onUpdate={fetchTodos} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  ) 
}