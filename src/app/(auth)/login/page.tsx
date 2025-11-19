import LoginForm from "@/components/auth/login/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Login | Horizon Tect Fest 2025",
  description:
    "Access your Horizon Tect Fest 2025 account and manage your event experience.",
};

function LoginPage() {
  return (
    <div className="flex items-center flex-col">
      <div className="mx-auto flex w-full flex-col my-10 gap-10 justify-center sm:w-[700px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-xl mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-sky-600 hover:underline">
            register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
