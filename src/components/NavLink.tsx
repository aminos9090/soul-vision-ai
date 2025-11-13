import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className" | "children"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, icon: Icon, isActive, children, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive: routerIsActive, isPending }) =>
          cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            (isActive || routerIsActive) && "bg-primary/10 text-primary font-semibold",
            className,
            (isActive || routerIsActive) && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
