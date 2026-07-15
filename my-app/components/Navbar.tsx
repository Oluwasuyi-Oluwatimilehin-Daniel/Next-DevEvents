import Link from "next/link";

const Navbar = () => {
  return (
    <header className="border-b border-zinc-950/30 sticky top-0 z-50 bg-zinc-950/30 backdrop-blur-lg">
      <nav className="flex items-center justify-between py-3 px-4">
        <Link className="text-xl font-medium tracking-tighter" href="/">Logo</Link>

        <ul className="flex items-center space-x-3 lg:space-x-7">
            <li className="text-sm">Home</li>
            <li className="text-sm">Events</li>
            <li className="text-sm">Create Event</li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
