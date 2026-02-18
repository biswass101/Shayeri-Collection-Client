import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ToastViewport = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "fixed top-4 left-3 right-3 z-[2147483647] flex max-h-screen w-auto flex-col gap-2 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 text-foreground shadow-lg",
  {
    variants: {
      variant: {
        default: "border-emerald-500/50 bg-emerald-500/20 text-foreground backdrop-blur-sm",
        destructive: "border-red-600/50 bg-red-600/15 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <li ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
));
Toast.displayName = "Toast";

const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  )
);
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition hover:text-foreground",
        className
      )}
      {...props}
    >
      <X size={14} />
    </button>
  )
);
ToastClose.displayName = "ToastClose";

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose };
