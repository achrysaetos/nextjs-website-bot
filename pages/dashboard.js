import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/user";
import Spinner from "../components/spinner";

export default function Dashboard({ lessons }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  console.log({ user });

  // Redirect to landing if user is not logged in
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  // Use the pre-rendered props from getStaticProps() to display all lessons
  return isLoading ? (
    <Spinner />
  ) : (
    <div className="w-full max-w-3xl mx-auto my-24 px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="relative flex items-start justify-between rounded-xl border border-gray-100 mb-4 p-4 shadow-xl sm:p-6 lg:p-8">
            <div className="pt-4 text-gray-500">
              <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                {lesson.title}
              </h3>
              <p className="mt-2 hidden text-sm sm:block">
                {lesson.description}
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600">
              New
            </span>
          </a>
        </Link>
      ))}
    </div>
  );
}

// Get all props from the lesson table at build time
export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");

  return {
    props: {
      lessons,
    },
  };
};
