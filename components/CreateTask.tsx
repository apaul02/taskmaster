"use client"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Flag, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, useEffect, useState } from "react";
import { createTask } from "@/lib/actions/createTask";
import { getTags } from "@/lib/actions/getTags";
import { TagType } from "@/lib/types";


const taskSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  priority: z.number(),
  deadline: z.date(),
  done: z.boolean(),
  tags: z.array(z.string()).default([]), 
});


export function CreateTask() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputTags, setInputTags] = useState<TagType[]>([]);

  const fetchTags = async () => {
    const latestTags = await getTags();
    setTags(latestTags);
  };
  
  useEffect(() => {
    fetchTags();
  }, []);

  const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    form.clearErrors("tags")
    setSearchTerm(e.target.value);
    const filteredItems = tags.filter((tag) => 
      tag.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredTags(filteredItems);
    setShowSuggestions(true);
  }

  const handleSuggestionClick = (tag: TagType) => {
    setSearchTerm("");
    if(inputTags.find((e) => e.name === tag.name)) {
      form.setError("tags", {
        type: "manual",
        message: "The tag is already selected"
      })
      setShowSuggestions(false); 
      setFilteredTags([]);  
      return;
    }
    const newTags = [...inputTags, tag];
    setInputTags(newTags); 
    setShowSuggestions(false); 
  };
  const handleCrossClick = (deleteTag: TagType) => {
    const newTags = inputTags.filter((tag) => tag.name !== deleteTag.name)
    setInputTags(newTags);
  }


  const { toast } = useToast();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 4,
      deadline: new Date(),
      done: false,
      tags: [], 
    },
  });
  

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      const response = await createTask(values.title, values.description, values.done, values.deadline, values.priority, inputTags)
      if(response.error){
        console.log(values)
        toast({
          title: "Unexpected error occured",
          description: response.error,
          variant: "destructive"
        })
        console.log(response.error);
        return
      }
      toast({
        title: "Task Created Successfully",
        description: response.message
      })
      form.reset()
      setInputTags([]);
      setSearchTerm("");

    }catch(e) {
      toast({
        title: "Error Occuerd",
        description: `${e}`,
        variant: "destructive"
      })
    }
  }
  
  return <div className="pt-20">
    <Card className="mx-20">
      <CardHeader>
        <CardTitle className="text-2xl">Create task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
                  <FormControl>
                    <Input className={`border-0 border-b rounded-none focus-visible:outline-none focus-visible:ring-0 `} placeholder="Title of your Task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Description</FormLabel>
                  <FormControl>
                    <Input className="border-0 border-b rounded-none focus-visible:outline-none focus-visible:ring-0" placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="relative">


          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                <Input
                  className={`border-0 border-b rounded-none focus-visible:outline-none focus-visible:ring-0 ${form.formState.errors.tags ? "border-red-500" : ""}`} placeholder="Tags"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onBlur={() => setShowSuggestions(false)} 
                  onFocus={() => searchTerm && setShowSuggestions(true)} 
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
      
      {showSuggestions && filteredTags.length > 0 && (
        <ul
          className="absolute bg-white dark:bg-black border rounded-md mt-1 shadow-lg max-h-60 overflow-auto w-full z-10"
          onMouseDown={(e) => e.preventDefault()} 
        >
          {filteredTags.map((tag) => (
            <li
              key={tag.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer"
              onClick={() => handleSuggestionClick(tag)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}
      <div>
  {inputTags.length > 0 && (
    <ul className="flex flex-wrap items-center gap-2 mt-2">
      {inputTags.map((tag) => (
        <div
          className="flex items-center bg-gray-100 dark:bg-zinc-900 text-inherit rounded-lg px-2 "
          key={tag.id}
        >
          <span className="mr-2">{tag.name}</span>
          <Button
            onClick={() => handleCrossClick(tag)}
            className="rounded-lg p-0 border-0 shadow-none hover:bg-transparent hover:scale-110"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </ul>
  )}
</div>

    </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg">Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        initialFocus
                      />
                      </PopoverContent>
                    </Popover>
                    <FormMessage /> 
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="pt-5 lg:pt-0 flex flex-col">
                    <FormLabel className="text-lg">Priority</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue="4">
                      <FormControl>
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1"><Flag color="#ff0000" fill="#ff0000" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="2"><Flag color="#ff530f" fill="#ff530f" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="3"><Flag color="#ffc800" fill="#ffc800" className="h-5 w-5" /></SelectItem>
                        <SelectItem value="4"><Flag color="#04ff00" fill="#04ff00" className="h-5 w-5" /></SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-5">
              <Button className="w-full sm:w-auto text-lg" type="submit">Create task</Button>
            </div>  
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
}