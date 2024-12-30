export type TagType = {
  id: number,
  name: string,
  userId: number
}

export interface Todo {
  id: number
  title: string
  description: string
  deadline: Date
  priority: number
  done: boolean
}

