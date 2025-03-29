"use client"
import React from 'react';
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import { toast } from 'sonner';
import {useRouter, usePathname} from "next/navigation";
import { UserContext } from '../../../context/UserContext';
import { useContext } from "react";
import axiosInstance from '@/app/axiosInstance';

const Navbar = ({ toggle }: { toggle: () => void }) => {
    const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const router = useRouter();
    const pathname = usePathname(); // Hook to get the current path

    const handleLogout = async() => {
      try{
          await axiosInstance.post(process.env.NEXT_PUBLIC_API_URL + "/logout", {}, 
          {
              withCredentials: true,
          })
      
          setIsLoggedIn(false);
          toast.success('Logged out');
          router.replace("/auth/login");
      }catch (err) {
          toast.success('Logged out');
          setIsLoggedIn(false); // log user out even if it fails
          router.replace("/auth/login");
      }
    }
    const handleRegister = () => {
      router.replace("/auth/register");
    }

    const handleProfile = () => {
      router.push("/profile");
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
                    <a href="mailto:devstorm.communications@gmail.com">
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
                    <div className="hidden md:flex gap-x-4">
                      {pathname !== "/profile" ? 
                        (
                        <button onClick={handleProfile}className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                            Profile
                        </button>
                        ): (<></>)}
                      <button onClick={handleLogout}className="hidden text-primary-100 md:block h-10 rounded-full bg-gray hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5 transition duration-300">
                        Logout
                      </button>
                    </div> : 
                    <>
                      <div className="hidden md:flex gap-x-4">
                        <Button />
                        <button onClick={handleRegister} className="h-10 rounded-full bg-gray hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5 transition duration-300">
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