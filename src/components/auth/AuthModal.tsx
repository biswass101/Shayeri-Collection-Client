import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";
import type { AuthUser } from "@/features/auth/authTypes";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: (user: AuthUser, token: string) => void;
};

export default function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const { addToast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!open) return null;

  const isLoading = loginState.isLoading || registerState.isLoading;
  const errorMessage =
    (loginState.error as { data?: { error?: string } } | undefined)?.data?.error ||
    (registerState.error as { data?: { error?: string } } | undefined)?.data?.error ||
    null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        role="presentation"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Welcome back. Please enter your credentials."
            : "Create your account to continue."}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              if (mode === "signin") {
                const response = await login({
                  email: formState.email,
                  password: formState.password,
                }).unwrap();
                onAuthenticated?.(response.data.user, response.data.token);
                addToast({
                  title: "Signed in",
                  description: `Welcome back, ${response.data.user.name}.`,
                });
                onClose();
                return;
              }

              const response = await register({
                name: formState.name,
                email: formState.email,
                password: formState.password,
              }).unwrap();
              onAuthenticated?.(response.data.user, response.data.token);
              addToast({
                title: "Account created",
                description: `Welcome, ${response.data.user.name}.`,
              });
              onClose();
            } catch (error) {
              const message =
                (error as { data?: { error?: string } } | undefined)?.data?.error ||
                "Authentication failed.";
              addToast({
                title: "Auth error",
                description: message,
                variant: "destructive",
              });
            }
          }}
        >
          {mode === "signup" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Your name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formState.password}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, password: event.target.value }))
                }
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
