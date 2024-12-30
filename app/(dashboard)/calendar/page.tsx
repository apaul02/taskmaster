import { Roboto } from "next/font/google"

const roboto = Roboto({ subsets: ['latin'],
  weight: "300"
})

export default  function CalendarPage() {
  return (
    <div className={`flex items-center justify-center min-h-screen ${roboto.className}`}>
      <h1 className="text-5xl md:text-7xl font-extrabold text-center">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Calendar feature
        </span>
        <span className="block mt-2 text-4xl md:text-6xl text-gray-800">
          is coming soon...
        </span>
      </h1>
    </div>
  )
}