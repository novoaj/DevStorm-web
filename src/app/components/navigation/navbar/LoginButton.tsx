import Link from "next/link";

const LoginButton = () => {

    return (
      <Link href="/auth/login">
        <button className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-6 rounded-full transition duration-300">Login</button>
      </Link>
    );
  };
  export default LoginButton;