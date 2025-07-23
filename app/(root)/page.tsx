import Link from "next/link";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleDropdown, SimpleDropdownItem, SimpleDropdownSeparator } from "@/components/ui/simpleDropdown";

import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

export default async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id),
    getLatestInterviews({ userId: user?.id ?? ""}),
  ]);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterviews = allInterviews && allInterviews.length > 0;

  const handleSignOut = async () => {
    "use server";
    await signOut();
    // Optional: redirect to home or login page
    // redirect('/');
  };

  return (
    <>
      {/* Profile Dropdown - Top Right */}
      <div className="flex justify-end mb-6">
        {user && (
          <SimpleDropdown
            trigger={
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-800/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileURL} alt={user.name} />
                  <AvatarFallback className="bg-green-600 text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
            align="right"
          >
            {/* User Info Section */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileURL} alt={user.name} />
                <AvatarFallback className="bg-green-600 text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* Manage Account */}
            <Link href="/profile">
              <SimpleDropdownItem className="flex items-center hover:bg-gray-800">
                <Settings className="mr-3 h-4 w-4" />
                <span>Manage account</span>
              </SimpleDropdownItem>
            </Link>
            
            <SimpleDropdownSeparator />
            
            {/* Sign Out */}
            <form action={handleSignOut} className="w-full">
              <button type="submit" className="w-full">
                <SimpleDropdownItem className="flex items-center hover:bg-gray-800 text-red-400 hover:text-red-300">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </SimpleDropdownItem>
              </button>
            </form>
          </SimpleDropdown>
        )}
      </div>

      {/* Hero Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* User's Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      {/* Explore More Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}
