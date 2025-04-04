"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginButton from "./LoginButton";
//import logo from "../../../../../public/images/logo_darkbg_rect.png"
import logo from "../../../../../public/images/Logo_2.png"
const Logo = () => {
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);

  // change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <img
          src={logo.src}
          alt="Logo"
          className="h-16 w-auto relative"
        />
      </Link>
      <div
        style={{
          display: showButton ? "block" : "none",
        }}
      >
        <LoginButton />
      </div>
    </>
  );
};

export default Logo;