import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

function Logo() {
  return (
    <div className="hidden items-center gap-x-2 md:flex">
      <Image
        src="/logo.svg"
        height="40"
        width="40"
        alt="logo"
        className="dark:invert"
      />
      <div className={cn("text-2xl font-semibold", font.className)}>
        Scaled Todo
      </div>
    </div>
  );
}

export default Logo;
