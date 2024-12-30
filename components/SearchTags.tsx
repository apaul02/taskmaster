"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { getTags } from "@/lib/actions/getTags";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { TagType } from "@/lib/types";

export function SearchTags() {
  const [searchItem, setSearchItem] = useState("");
  const [inputTags, setInputTags] = useState<TagType[]>([])
  const [tags, setTags] = useState<TagType[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchTags = async () => {
    const latestTags = await getTags();
    setTags(latestTags);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTags(filteredItems);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (tag: TagType) => {
    setSearchItem("");
    if(inputTags.find((e) => e.name === tag.name)) {
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

  return (
    <div className="relative">
      <Input
        value={searchItem}
        onChange={handleInputChange}
        onBlur={() => setShowSuggestions(false)} 
        onFocus={() => searchItem && setShowSuggestions(true)} 
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
  );
}
