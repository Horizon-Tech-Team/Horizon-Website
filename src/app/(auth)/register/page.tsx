import RegisterForm from "@/components/auth/register/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | Horizon Tect Fest 2025",
  description:
    "Sign up for Horizon Tect Fest 2025 and be a part of the future of technology and innovation.",
};

const RegisterPage = () => {
  return (
    <div className="flex items-center flex-col">
      <div className="mx-auto flex w-full flex-col my-10 justify-center sm:w-[700px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete the steps below to create your account
          </p>
        </div>
        <RegisterForm />
        <div className="text-center text-xl mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-600 hover:underline">
            login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
