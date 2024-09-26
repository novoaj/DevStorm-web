"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import {jwtDecode} from "jwt-decode";
import { toast } from 'sonner';
import {useRouter, usePathname} from "next/navigation";
import { UserContext } from '../../../context/UserContext';
import { useContext } from "react";
import axios from 'axios';
import { fetchCSRFToken } from '@/app/actions/actions';

const Navbar = ({ toggle }: { toggle: () => void }) => {
    const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const router = useRouter();
    const pathname = usePathname(); // Hook to get the current path

    const handleLogout = async() => {
      const csrfToken = await fetchCSRFToken();
      axios.post("http://127.0.0.1:5000/logout", {}, 
        {
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfToken,  // Add CSRF token to headers
        }
        }
      ).then((response) => {
        setIsLoggedIn(false);
        toast.success('Logged out');
        router.replace("/login");
        }
      )
      .catch((err)=> {
        console.log("error logging out: ", err);
      })  
    }

    return (
      <>
        <div className="w-full h-20 bg-primary-100 sticky top-0">
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
                  <button onClick={handleLogout}className="hidden md:block h-10 rounded-lg bg-white hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5">Logout</button>
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