"use client";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useAuthContext } from "./providers/auth-provider";
import { Spinner } from "./Spinner";

function Navbar() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, logout, user } = useAuthContext();
  const scrolled = useScrollTop();
  const router = useRouter();

  function handleLogout() {
    setLoading(true);
    setTimeout(() => {
      logout();
      setLoading(false);
    }, 500);
  }
  return (
    <div
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between bg-background p-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      {/* Left Section: Logo */}
      <Link href="/" className="flex items-center">
        <Logo />
      </Link>

      {/* Middle Section: Search Bar */}

      {/* Right Section: Buttons and Mode Toggle */}
      <div className="flex items-center gap-x-2">
        {loading && <Spinner />}
        {!isAuthenticated && !loading && (
          <>
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
        {isAuthenticated && !loading && (
          <>
            <Link href="/dashboard">
              <Button variant="ghost">
                <div className="text-base capitalize">
                  Hello, {user?.user?.username}
                </div>
              </Button>
            </Link>
            <Button size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
            {user?.user?.isAdmin ? (
              <Link href="/product/new">
                <Button variant="outline" size="sm">
                  +
                </Button>
              </Link>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
