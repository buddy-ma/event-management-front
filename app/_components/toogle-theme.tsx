import { useTheme } from "next-themes";
import { Button } from "@/app/_components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="sm"
      variant="ghost"
      className="w-[60%] justify-center text-primary px-0 mx-2"
    >
      <div className="flex gap-2 dark:hidden">
        <Moon className="size-5" />
        <span className="block lg:hidden"> Dark </span>
      </div>

      <div className="dark:flex gap-2 hidden">
        <Sun className="size-5" />
        <span className="block lg:hidden">Light</span>
      </div>

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
