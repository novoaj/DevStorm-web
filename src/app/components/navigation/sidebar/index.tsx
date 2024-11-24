"use client"
import Link from "next/link";
import { UserContext } from '../../../context/UserContext';
import { useContext } from "react";
import {toast} from "sonner";
import { useRouter} from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

const Sidebar = ({ isOpen, toggle, } : { isOpen: boolean; toggle: () => void; }): JSX.Element => {
  const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async() => {
    try{
        await axiosInstance.post(process.env.NEXT_PUBLIC_API_URL + "/logout", {}, 
        {
            withCredentials: true,
        })
    
        setIsLoggedIn(false);
        toast.success('Logged out');
        router.replace("/login");
    }catch (err) {
        toast.success('Logged out');
        setIsLoggedIn(false); // log user out even if it fails
        router.replace("/login");
    }
  }
  return (
    <>
      <div
        className="sidebar-container fixed w-full h-full overflow-hidden justify-center bg-primary-100 text-slate-100 grid pt-[120px] left-0 z-10"
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: ` ${isOpen ? "0" : "-100%"}`,
        }}
      >
        <button className="absolute right-0 p-5" onClick={toggle}>
        {/* Close icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"> 
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            />
          </svg>
        </button>

        <ul className="sidebar-nav text-center leading-relaxed text-xl">
          <li>
            <Link href="/about" onClick={toggle}><p>About</p></Link>
          </li>
          <li>
            <Link href="/contacts" onClick={toggle}><p>Contact Us</p></Link>
          </li>
          {isLoggedIn ? 
            <>
              <li>
                <Link href="/profile"><p>Profile</p></Link>
              </li>
              <li>
                <Link href="/" onClick={handleLogout}><p>Logout</p></Link>
              </li>
            </>: 
            <>
              <li>
                <Link href="/login" onClick={toggle}><p>Login</p></Link>
              </li>
              <li>
                <Link href="/register" onClick={toggle}><p>Register</p></Link>
              </li>
            </>}
          
        </ul>
      </div>
    </>
  );
};

export default Sidebar;