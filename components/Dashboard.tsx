'use client'

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { EditTaskButton } from "./EditTaskButton"
import { DeleteTaskButton } from "./DeleteTaskButton"
import { Flag } from "lucide-react"
import { toggleTodo } from "@/lib/actions/toggleTodo"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { undoToggle } from "@/lib/actions/undoToggle"
import { getTodosOfToday } from "@/lib/actions/getTodosOfToday"
import { Playfair_Display, Roboto } from 'next/font/google'
import { Todo } from "@/lib/types"

const playfair = Playfair_Display({ subsets: ['latin'],
  weight: "400"
})

const roboto = Roboto({ subsets: ['latin'],
  weight: "300"
})




export function getPriorityFlag(priority: number) {
  switch(priority) {
    case 1:
      return <Flag color="#ff0000" fill="#ff0000" className="h-5 w-5" />
    case 2: 
      return <Flag color="#ff530f" fill="#ff530f" className="h-5 w-5" />
    case 3: 
      return <Flag color="#ffc800" fill="#ffc800" className="h-5 w-5" />
    case 4: 
      return <Flag color="#04ff00" fill="#04ff00" className="h-5 w-5" />
    default:
      return <Flag color="#fffff" fill="#fffff" className="h-5 w-5" />
  }
}

export function Dashboard() {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getTodosOfToday();
      
      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
        setTodos([]);
      } else {
        setTodos(response.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load tasks. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    fetchTodos();
  }, []);

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
        <h1 className="text-3xl md:text-4xl font-semibold pb-2 font-montserrat w-full text-center">
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
    <div className={`container mx-auto px-4`}>
      <h1 className="text-3xl md:text-4xl font-semibold pb-2 font-montserrat w-full text-center">
        Welcome back
      </h1>
      <div className="py-4 text-xl md:text-2xl flex justify-center font-semibold">
        Today's Tasks
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className={`${todo.done ? 'hidden' : 'opacity-100 h-auto'}`}
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
                  <CardTitle className={`text-lg ${todo.done ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.title}
                  </CardTitle>
                  <CardDescription className={todo.done ? 'line-through text-muted-foreground' : ''}>
                    {todo.description}
                  </CardDescription>
                </div>
              </CardContent>
              <div className="flex justify-center pt-3">
                <EditTaskButton todo={todo} onUpdate={fetchTodos} />
                <DeleteTaskButton id={todo.id} onUpdate={fetchTodos} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}