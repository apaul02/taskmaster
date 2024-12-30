"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { EditTaskButton } from "./EditTaskButton"
import { DeleteTaskButton } from "./DeleteTaskButton"
import { getPriorityFlag } from "./Dashboard"
import { useEffect, useState } from "react"
import { toggleTodo } from "@/lib/actions/toggleTodo"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { undoToggle } from "@/lib/actions/undoToggle"
import { getTodos } from "@/lib/actions/getTodos"
import { Roboto } from "next/font/google"
import { Todo } from "@/lib/types"

const roboto = Roboto({ subsets: ['latin'],
  weight: "300"
})



export const formatDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.toLocaleDateString("en-CA");
};

const getMonth = (date: string) => {
  return date.split("-")[1];
}

const getYear = (date: string) => {
  return date.split("-")[0];
}

const getDay = (date: string) => {
  return date.split("-")[2];
}

const getMonthName = (monthNum: string) => {
  const months: Record<string, string> = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };
  return months[monthNum];
};


export function SortedTasks() {
  const { toast } = useToast();
  const [ todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTodos();
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
    fetchTodos();
  }, [])



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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = formatDate(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = formatDate(tomorrow);
  const currentYear = today.getFullYear().toString();
  

  const sortedTodos = [...todos].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  const groupedByYearAndMonthDay = sortedTodos.reduce((acc: Record<string, Record<string, Record<string, Todo[]>>>, todo) => {
    if(todo.done) {
      return acc;
    }
    const todoDate = new Date(todo.deadline);
    todoDate.setHours(0, 0, 0, 0);
    const dateKey = formatDate(todoDate);
    
    if (todoDate < today) {
      if (!acc["Overdue"]) {
        acc["Overdue"] = { "Overdue": { "Overdue": [] } };
      }
      acc["Overdue"]["Overdue"]["Overdue"].push(todo);
    } else {
      const year = getYear(dateKey);
      const month = getMonth(dateKey);
      const day = getDay(dateKey);
      
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = {};
      }
      if (!acc[year][month][day]) {
        acc[year][month][day] = [];
      }
      acc[year][month][day].push(todo);
    }
    
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYearAndMonthDay).sort((a, b) => {
    if (a === "Overdue") return -1;
    if (b === "Overdue") return 1;
    return parseInt(a) - parseInt(b);
  });

  return (
    <div className={`w-full min-h-screen bg-background py-4 md:p-6 lg:p-8 `}>
      <div className="grid gap-8">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-6">
            <h1 className={`text-4xl font-bold ${roboto.className} ${year === "Overdue" ? "text-red-500" :
              year === currentYear ? "hidden" : ""
            }`}>
              {year}
            </h1>
            {Object.keys(groupedByYearAndMonthDay[year])
              .sort((a, b) => {
                if (a === "Overdue") return -1;
                if (b === "Overdue") return 1;
                return parseInt(a) - parseInt(b); 
              })
              .map((month) => (
                <div key={`${year}-${month}`} className="bg-card rounded-lg py-4 md:p-6">
                  <h2 className={`text-3xl font-bold mb-2 ${
                    year === "Overdue" ? "text-red-500" : "text-primary"
                  } ${roboto.className}`}>
                    {month === "Overdue" ? "" : getMonthName(month)}
                  </h2>
                  {Object.keys(groupedByYearAndMonthDay[year][month])
                    .sort((a, b) => {
                      if (a === "Overdue") return -1
                      if (b === "Overdue") return 1
                      return parseInt(a) - parseInt(b)
                    })
                    .map((day) => (
                      <div key={`${year}-${month}-${day}`} className="">
                        <h3 className={`text-2xl font-semibold mb-3`}>
                          {formatDate(groupedByYearAndMonthDay[year][month][day][0].deadline) === todayString ? "Today" :
                           day === "Overdue" ? "" :
                           formatDate(groupedByYearAndMonthDay[year][month][day][0].deadline) === tomorrowString ? "Tomorrow" :
                           `${getMonthName(month)} ${parseInt(day)}`}
                        </h3>
                        <ul className="space-y-1">
                          {groupedByYearAndMonthDay[year][month][day]
                            .sort((a, b) => a.priority - b.priority)
                            .map((todo) => (
                              <li
                                key={todo.id}
                                className={`bg-background rounded-lg py-4`}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className="flex flex-col gap-3">
                                    <Checkbox
                                      className="mt-3 rounded-full"
                                      checked={todo.done}
                                      onCheckedChange={async () => await handleToggle(todo.id)}
                                    />
                                    <div>
                                      {getPriorityFlag(todo.priority)}
                                    </div>
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between">
                                      <h4
                                        className={`text-xl font-semibold`}
                                      >
                                        {todo.title}
                                      </h4>
                                      <div className="flex justify-end">
                                      <EditTaskButton todo={todo} onUpdate={fetchTodos} />
                                      <DeleteTaskButton id={todo.id} onUpdate={fetchTodos} />
                                      </div>
                                    </div>
                                    <p
                                      className={`text-muted-foreground`}
                                    >
                                      {todo.description}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-muted-foreground">
                                        Deadline: {formatDate(todo.deadline)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}