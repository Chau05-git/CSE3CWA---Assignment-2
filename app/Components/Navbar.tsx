"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import "./Navbar_style.css";

type Theme = "light" | "dark";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

 
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const initial: Theme =
        stored ??
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch {
      
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const handleHamburgerClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <ul className="nav_list">
        <li className="nav_item"><Link href="/">Home</Link></li>
        <li className="nav_item"><Link href="#pre-lab">Pre-lab Question</Link></li>
        <li className="nav_item"><Link href="/EscapeRoom">Escape room</Link></li>
        <li className="nav_item"><Link href="#contact">Coding races</Link></li>
      </ul>
      <ul className="about_n_hamburger">
        <li className="about"><Link href="#about">about</Link></li>

        

        <li className="hamburger_menu">
          <div className="hamburger_icon" onClick={handleHamburgerClick}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </li>
      </ul>
      {showMenu && (
        <div className="hamburger_dropdown">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="#about">About</Link></li>
            <li><Link href="/EscapeRoom">Escape room</Link></li>
            <li><Link href="#contact">Coding races</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;