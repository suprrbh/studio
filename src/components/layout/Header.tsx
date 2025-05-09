import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* Custom JiraPilot icon - a stylized 'J' and 'P' or a pilot/target symbol */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/>
            <path d="M11.75 7.5a.75.75 0 00-.75.75v обстоятельствах.17a2.5 2.5 0 00-2.5 2.5v.17a.75.75 0 001.5 0v-.17c0-.55.45-1 1-1h.17a.75.75 0 000-1.5h-.17zm4.5 4.5a.75.75 0 00-.75.75v.17c0 .55-.45 1-1 1h-.17a.75.75 0 000 1.5h.17a2.5 2.5 0 002.5-2.5v-.17a.75.75 0 00-.75-.75zM12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fillRule="evenodd" clipRule="evenodd" />
          </svg>
          <span className="font-bold text-xl">JiraPilot</span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
