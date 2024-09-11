"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/ReactToastify.min.css';
import {useRouter, usePathname} from "next/navigation";

const Navbar = ({ toggle }: { toggle: () => void }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // Hook to get the current path
    const tokenIsExpired = (token: string | null) => {
      if (token === null){
        return true;
      }
      let decoded = jwtDecode(token)
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("access");
        return true;
      }
      return false;
    }
    const checkIsLoggedIn = () => {
      // check if access token exists, is access token expired?
      let token = localStorage.getItem("access")
      if(tokenIsExpired(token)) {
        setIsLoggedIn(false);
      }else{
        setIsLoggedIn(true);
      }
    }

    const handleLogout = () => {
      localStorage.removeItem("access");
      toast.success('Logged out', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        router.push("/login");
    }
    useEffect(() => {
      checkIsLoggedIn(); // Check login status on component mount
    }, [pathname]);

    return (
      <>
        <div className="w-full h-20 bg-primary-100 sticky top-0">
          <ToastContainer/>
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-between items-center h-full">
              <Logo />
              <button
                type="button"
                className="inline-flex items-center md:hidden"
                onClick={toggle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#fff"
                    d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
                  />
                </svg>
              </button>
              <ul className="hidden md:flex gap-x-6 text-white">
                <li>
                  <Link href="/about">
                    <p>About Us</p>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <p>Contact Us</p>
                  </Link>
                </li>
              </ul>
              {isLoggedIn ? 
                <>
                  <button onClick={handleLogout}className="h-10 rounded-lg bg-white hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5">Logout</button>
                </> : 
                <>
                  <div className="hidden md:block">
                    <Button />
                  </div>
                </>}
            </div>
          </div>
        </div>
      </>
    );
};

export default Navbar;