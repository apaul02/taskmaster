import { Appbar } from "@/components/Appbar";
import { FeatureCard } from "@/components/FeatureCard";
import { BookPlus, CheckCheck, ListTodo, Users } from "lucide-react"
import { Star } from "lucide-react";
import { Calendar } from "lucide-react";
import { GetStartedButton } from "./GetStartedButton";
import { LearnMoreButton } from "./LearnMoreButton";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Appbar />
        <main className="flex-grow pt-16">
          <section className="w-full py-16 md:py-32">
            <div className="px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="">
                  <div className="h-[120px] md:h-[180px] overflow-hidden max-w-[800px]">
                    <h1 className="text-5xl md:text-7xl tracking-tighter text-center animate-slideIn">
                      Manage Your Tasks
                    </h1>
                    <div className="h-[120px] md:h-[180px] overflow-hidden">
                      <h1 className="text-5xl md:text-7xl tracking-tighter text-center animate-slideIn">
                        with {" "}
                        <span className="font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 bg-200% animate-gradientCycle">
                          Ease
                        </span>
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-center overflow-hidden">
                    <p className="mx-auto py-4 md:py-8 text-gray-500 text-lg md:text-2xl max-w-[800px] text-center animate-fadeIn">
                      TaskMaster helps you organize, prioritize, and accomplish your goals with powerful features and an intuitive interface.
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden px-4 py-2">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 animate-slideIn">
                    <GetStartedButton />
                    <LearnMoreButton />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-16 md:py-32">
            <div className="flex flex-col items-center px-4 md:px-8">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-center max-w-[800px] mb-8 md:mb-16">
                Features That Empower {" "}
                <span className="leading-tight text-5xl md:text-7xl gap-8 font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 bg-200% animate-gradientCycle">
                  You
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
              <FeatureCard
                icon={<ListTodo className="w-8 h-8" />}
                title="Task Management"
                description="Create, edit, and organize your tasks with ease. Add details, due dates.">
              </FeatureCard>
              <FeatureCard
                icon={<Star className="w-8 h-8" />}
                title="Priority Setting"
                description="Assign priorities to your tasks and focus on what matters most. Never miss important deadlines.">
              </FeatureCard>
              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Calendar View"
                description="Visualize your tasks in a calendar format. Plan your days, weeks, and months efficiently.">
              </FeatureCard>
              <FeatureCard
                icon={<BookPlus className="w-8 h-8" />}
                title="Custom Categories"
                description="Create personalized categories and tags to organize your tasks in a way that makes sense to you.">
              </FeatureCard>
              <FeatureCard
                icon={<CheckCheck className="w-8 h-8" />}
                title="Progress Tracking"
                description="Monitor your productivity with insightful statistics and progress reports.">
              </FeatureCard>
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Collaborative Work"
                description="Share and work together towards goal with your friends.">
              </FeatureCard>
            </div>
          </section>
          <section className="w-full py-16 md:py-24">
            <div className="flex flex-col items-center px-4 md:px-8">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-center max-w-[800px] mb-8">
                Ready to Boost Your {" "}
                <span className="leading-tight text-5xl md:text-7xl gap-8 font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 bg-200% animate-gradientCycle">
                  Productivity?
                </span>
              </h1>
              <div className="pt-4 md:pt-8">
                <GetStartedButton />
              </div>
              <div className="flex justify-center overflow-hidden">
                <p className="mx-auto py-4 font-montserrat text-gray-500 text-lg md:text-xl max-w-[800px] text-center animate-fadeIn">
                  Don&apos;t Worry Its FREE!
                </p>
              </div>
            </div>
          </section>
        <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-inherit backdrop-blur-sm dark:bg-inherit">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Made by Ankan Paul
            </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <div className="text-xs hover:underline underline-offset-4 transition-all duration-300 ease-in-out hover:text-primary">
              Terms of Service
            </div>
            <div className="text-xs hover:underline underline-offset-4 transition-all duration-300 ease-in-out hover:text-primary">
              Privacy
            </div>
          </nav>
      </footer>
        </main>
      </div>
    </div>
  );
}