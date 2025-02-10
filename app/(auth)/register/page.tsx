"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/src/components/Toast/ToastService";
import { signIn, useSession } from "next-auth/react";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // First, register the user
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            confirm_password: data.confirm_password,
          }),
        }
      );

      const result = await registerResponse.json();

      if (!registerResponse.ok) {
        console.log(result);
        throw new Error(result.message || "Registration failed");
      }

      // If registration is successful, automatically sign in
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });

      if (signInResult?.ok) {
        toast.success("Registration successful! Welcome!");
        router.push("/");
      } else {
        toast.error(
          "Registration successful but login failed. Please login manually."
        );
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-[calc(100vh-300px)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8 rounded-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm_password"
                  type="password"
                  {...register("confirm_password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
