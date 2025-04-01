"use client";
import { useRouter } from "next/navigation";

const LoginButton = () => {
    const router = useRouter();
    const handleRedirect = () => {
        router.push("/auth/login");
    }
    return (
      <button onClick={handleRedirect}className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-6 rounded-full transition duration-300">Login</button>
    );
  };
  export default LoginButton;