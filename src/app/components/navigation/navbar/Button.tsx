"use client";
import { useRouter } from "next/navigation";

const Button = () => {
    const router = useRouter();
    const handleRedirect = () => {
        router.push("/login");
    }
    return (
      <button onClick={handleRedirect}className="h-10 rounded-lg bg-white hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5">Sign In</button>
    );
  };
  export default Button;