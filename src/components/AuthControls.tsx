"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="h-8 w-20 rounded-md bg-[#201f22]" />;
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <>
      <SignInButton mode="modal">
        <button className="rounded-md border border-[#3c4a42] px-3 py-1.5 text-sm text-[#bbcabf] hover:bg-[#201f22] hover:text-[#e5e1e4]">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="hidden rounded-md bg-[#4edea3] px-3 py-1.5 text-sm font-semibold text-[#003824] hover:bg-[#6ffbbe] sm:inline-flex">
          Sign up
        </button>
      </SignUpButton>
    </>
  );
}
