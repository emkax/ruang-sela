"use client";

import type { Route } from "next";
import Link from "next/link";
import { Bell, Menu, Settings, X } from "lucide-react";
import { useState } from "react";

export interface NavLink {
  label: string;
  href: Route;
}

export interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  activeHref?: string;

  authenticated?: boolean;
  userInitial?: string;

  onSignIn?: () => void;
  onSignUp?: () => void;

  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const DEFAULT_LINKS: NavLink[] = [
  {
    label: "Home",
    href: "/" as Route,
  },
  {
    label: "Search Spaces",
    href: "/search" as Route,
  },
  {
    label: "My Submissions",
    href: "/submissions" as Route,
  },
];

export default function Navbar({
  logoText = "RuangSela",
  links = DEFAULT_LINKS,
  activeHref = "/",

  authenticated = false,
  userInitial = "A",

  onSignIn,
  onSignUp,

  onNotificationClick,
  onSettingsClick,
  onProfileClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: Route) => {
    const hrefStr = String(href);
    const activeStr = String(activeHref);

    if (hrefStr === "/") {
      return activeStr === "/";
    }

    return (
      activeStr === hrefStr ||
      activeStr.startsWith(`${hrefStr}/`) ||
      activeStr.startsWith(`${hrefStr}?`)
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    closeMobileMenu();
    onSignIn?.();
  };

  const handleSignUp = () => {
    closeMobileMenu();
    onSignUp?.();
  };

  const handleNotificationClick = () => {
    closeMobileMenu();
    onNotificationClick?.();
  };

  const handleSettingsClick = () => {
    closeMobileMenu();
    onSettingsClick?.();
  };

  const handleProfileClick = () => {
    closeMobileMenu();
    onProfileClick?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        {/* Logo */}
        <Link
          href="/" as Route
          className="text-xl font-bold text-gray-900"
          onClick={closeMobileMenu}
        >
          {logoText}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={String(link.href)}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {authenticated ? (
            <>
              <button
                type="button"
                onClick={onNotificationClick}
                aria-label="Open notifications"
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onSettingsClick}
                aria-label="Open settings"
                className="hidden rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:inline-flex"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onProfileClick}
                aria-label="Open profile"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white shadow-sm transition hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2"
              >
                {userInitial.slice(0, 1).toUpperCase()}
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={onSignIn}
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={onSignUp}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="ml-1 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-100 bg-white px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={String(link.href)}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Buttons */}
          {!authenticated && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:hidden">
              <button
                type="button"
                onClick={handleSignIn}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleSignUp}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile User Menu */}
          {authenticated && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:hidden">
              <button
                type="button"
                onClick={handleNotificationClick}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                Notifications
              </button>

              <button
                type="button"
                onClick={handleSettingsClick}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                Settings
              </button>

              <button
                type="button"
                onClick={handleProfileClick}
                className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  {userInitial.slice(0, 1).toUpperCase()}
                </span>
                Profile
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
