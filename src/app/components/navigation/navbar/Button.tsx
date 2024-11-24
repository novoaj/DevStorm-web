"use client";
import { useRouter } from "next/navigation";

const Button = () => {
    const router = useRouter();
    const handleRedirect = () => {
        router.push("/login");
    }
    return (
      <button onClick={handleRedirect}className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Login</button>
    );
  };
  export default Button;