'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href || (href === '/' && pathname.startsWith('/flashcards'));
    return `py-4 px-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
    } transition-colors duration-200`;
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar with Logo and Auth */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-700"
          >
            Noor Al Bayaan
          </Link>

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
      {/* Bottom bar with Navigation Tabs */}
      <div className="container mx-auto px-4 border-t border-gray-200">
        <nav className="flex items-center gap-6">
          <Link href="/" className={getLinkClassName('/')}>
            Flash Cards
          </Link>
          <SignedIn>
            <Link href="/status" className={getLinkClassName('/status')}>
              Progress
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 text-sm font-medium transition-colors duration-200">
                Progress
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
} 