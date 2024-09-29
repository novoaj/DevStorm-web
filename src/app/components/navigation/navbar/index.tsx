"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
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
        toast.success('Logged out');
        setIsLoggedIn(false); // log user out even if it fails
      })  
    }
    const handleRegister = () => {
      router.replace("/register");
    }

    return (
      <>
        <div className="w-full h-24 bg-primary-300 sticky top-0 z-40 border-b border-primary-200">
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-between items-center h-full w-full">
              <Logo />
              <div className="flex-grow flex justify-start ml-20">
                <ul className="hidden md:flex gap-x-6 text-gray">
                  <li className="hover:text-slate-100">
                    <Link href="/about">
                      <p>About Us</p>
                    </Link>
                  </li>
                  <li className="hover:text-slate-100">
                    <a href="mailto:devstorm.ai@gmail.com">
                      <p>Contact Us</p>
                    </a>
                  </li>
                </ul>
              </div>
                <div className="flex-grow flex justify-end">
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
                  {isLoggedIn ? 
                    <>
                      <button onClick={handleLogout}className="hidden text-primary-100 md:block h-10 rounded-lg bg-gray hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5 transition duration-300">
                        Logout
                      </button>
                    </> : 
                    <>
                      <div className="hidden md:flex gap-x-4">
                        <Button />
                        <button onClick={handleRegister} className="h-10 rounded-lg bg-gray hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5 transition duration-300">
                          Register
                        </button>
                      </div>
                    </>}
                </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default Navbar;