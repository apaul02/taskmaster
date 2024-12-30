import { ReactNode } from "react";

export function FeatureCard({icon, title, description}: {icon: ReactNode, title: string, description: string}){
  return (
    <div className="flex flex-col items-center text-center p-6 md:p-12 bg-inherit backdrop-blur-sm rounded-lg">
      {icon}
      <h3 className="text-xl md:text-2xl font-semibold pt-2 mb-1">{title}</h3>
      <p className="text-gray-500 pt-2 text-lg md:text-xl dark:text-gray-400">{description}</p>
    </div>
  )
}