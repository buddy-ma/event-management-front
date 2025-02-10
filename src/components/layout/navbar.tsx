"use client";
import { LogIn, LogOut, Menu, User } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Separator } from "@/src/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";

import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "@/src/components/layout/toogle-theme";
import { useEffect, useState } from "react";
import { signOut, useSession, SessionProvider } from "next-auth/react";
import { Button } from "@/src/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface RouteProps {
  href: string;
  label: string;
}

const NavbarContent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { data: session } = useSession();

  // Use dictionary values in the routeList

  const routes = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`hover:shadow-lg transition-shadow duration-300 backdrop-filter backdrop-blur-lg bg-opacity-50 bg-opacity-30 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky z-40 rounded-2xl flex justify-between items-center p-2 hover:border-2 hover:border-secondary ${
        scrolled ? "border-2 border-secondary" : "border-2 border-transparent"
      }`}
    >
      <Link href="/" className="font-bold text-lg flex items-center">
        <Image
          src="/logo.png"
          alt="RadixLogo"
          className="h-full w-full rounded-md object-cover"
          width={100}
          height={100}
        />
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-white border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="RadixLogo"
                      className="h-full w-full rounded-md object-cover"
                      width={100}
                      height={100}
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routes.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base text-black dark:text-white"
                  >
                    <Link className="text-black dark:text-white" href={href}>
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />

              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {routes.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-primary px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex items-center gap-0">
        <ToggleTheme />
        {session ? (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-primary text-white ml-4"
                >
                  Welcome, {session.user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem className="text-primary flex items-center">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer text-primary"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex h-10 bg-primary border-none rounded-lg w-full items-center justify-center px-4 border text-white"
          >
            <span className="text-sm">Login</span>
            <LogIn className="ml-2 size-5" />
          </Link>
        )}
      </div>
    </header>
  );
};

export const Navbar = () => {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  );
};
