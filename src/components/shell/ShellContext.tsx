"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "pimpinan";

interface ShellContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isRail: boolean;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({
  children,
  defaultRole = "admin",
}: {
  children: React.ReactNode;
  defaultRole?: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1600);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width >= 640) {
        setMobileDrawerOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isRail = !isMobile && (isTablet || sidebarCollapsed);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <ShellContext.Provider
      value={{
        role,
        setRole,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        toggleSidebar,
        isMobile,
        isTablet,
        isRail,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}
