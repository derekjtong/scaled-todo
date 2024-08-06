"use client";

import { signupUser } from "@/api/user";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { login, user } = useAuthContext();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const userData: User = {
        _uid: "",
        username,
        password,
        email,
      };
      const response = await signupUser(userData);
      login(response.data.token);
      router.push("/");
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={true}
            />
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin">
                <Spinner />
              </div>
            )}
            Register
          </Button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </form>
    </div>
  );
}
