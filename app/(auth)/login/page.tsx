"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/app/_components/toast/ToastService";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Handle redirect in useEffect instead of during render
  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log(result);

      if (result?.ok) {
        toast.success("Welcome back!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8 rounded-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            Welcome Back!
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17ZM17 8H16V6C16 4.93913 15.5786 3.92172 14.8284 3.17157C14.0783 2.42143 13.0609 2 12 2C10.9391 2 9.92172 2.42143 9.17157 3.17157C8.42143 3.92172 8 4.93913 8 6V8H7C6.20435 8 5.44129 8.31607 4.87868 8.87868C4.31607 9.44129 4 10.2044 4 11V19C4 19.7957 4.31607 20.5587 4.87868 21.1213C5.44129 21.6839 6.20435 22 7 22H17C17.7957 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7957 20 19V11C20 10.2044 19.6839 9.44129 19.1213 8.87868C18.5587 8.31607 17.7957 8 17 8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
