
import { SortedByTags } from "@/components/SortedByTags";

export default async function Tagpage({ params }: { params: Promise<{tagName: string}>}) {
  const tag = (await params).tagName
  


  if(!tag) {
    return <div>Tag not found</div>
  }
  return (
    <div>
      <div>
        <SortedByTags tagName={tag} />
      </div>
  </div>  
  )
  
}