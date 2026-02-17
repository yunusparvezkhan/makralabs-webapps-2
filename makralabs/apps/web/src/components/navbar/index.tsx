"use client";

import { useEffect, useState, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

interface NavbarLink {
  href: string;
  label: string;
}

interface NavbarProps {
  logoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  githubRepo?: string;
  links?: NavbarLink[];
}

export function Navbar({
  logoUrl = "/logo/192x192.png",
  twitterUrl = "https://twitter.com/makralabs",
  githubUrl = "https://github.com/makralabs",
  githubRepo = "makralabs/makra",
  links = [
    // { href: "/playground", label: "Playground" },
    // { href: "/dashboard", label: "Dashboard" },
    // { href: "/pricing", label: "Pricing" },
  ],
}: NavbarProps) {
  const [starsCount, setStarsCount] = useState(0);
  const animateRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   let targetStars = 0;

  //   const fetchStarsCount = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.github.com/repos/${githubRepo}`
  //       );
  //       if (!response.ok) return;
  //       const data = await response.json();
  //       targetStars = Number(data.stargazers_count) || 0;

  //       if (targetStars > 0) {
  //         let current = 0;
  //         const increment = Math.max(1, Math.floor(targetStars / 30));
  //         const animate = () => {
  //           current += increment;
  //           if (current >= targetStars) {
  //             setStarsCount(targetStars);
  //           } else {
  //             setStarsCount(current);
  //             animateRef.current = setTimeout(animate, 18);
  //           }
  //         };
  //         animate();
  //       } else {
  //         setStarsCount(targetStars);
  //       }
  //     } catch {
  //       console.error(`Failed to fetch stars count for ${githubRepo}`);
  //     }
  //   };
  //   fetchStarsCount();
  //   return () => {
  //     if (animateRef.current) {
  //       clearTimeout(animateRef.current);
  //     }
  //   };
  // }, [githubRepo]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-screen flex justify-center"
      style={{
        height: "66px",
        backgroundColor: "var(--makra-background-light)",
      }}
    >
      <div className="h-full w-[80%] flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Makra Labs Logo"
                width={28}
                height={28}
                className="w-8 h-8"
              />
              <div
                className="font-bold"
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "var(--font-cormorant)",
                  color: "var(--makra-primary-green)",
                }}
              >
                Makra
                <span style={{ color: "var(--makra-foreground-dark)" }}>
                  labs
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4">
          {links.length > 0 && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium w-full justify-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[var(--makra-primary-green)] transition-opacity px-2 py-2 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div
          className="hidden md:flex items-center gap-4 text-sm font-medium"
          style={{
            fontFamily: "var(--font-open-sans)",
            color: "var(--makra-foreground-dark-100)",
          }}
        >
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: "var(--makra-foreground-dark-100)" }}
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity flex flex-row items-center relative"
            style={{ color: "var(--makra-foreground-dark-100)" }}
          >
            <FaGithub size={20} />
            {/*<span className="text-xs pl-1">
              {starsCount > 0 ? starsCount.toLocaleString() : "0 ..."}
            </span>*/}
          </a>
          {/*<Link href="/login">
            <button className="makra-web-btn-green text-white text-sm px-2 py-1 rounded-md cursor-pointer">
              Sign In
            </button>
          </Link>*/}
        </div>
      </div>
    </nav>
  );
}
