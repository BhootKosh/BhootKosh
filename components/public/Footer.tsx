import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t-[3px] border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden border-[3px] border-gold bg-saffron shadow-[3px_3px_0_0_#f4c430]">
              <Image
                src="/images/logo.svg"
                alt="BhootKosh — ghost logo"
                width={48}
                height={48}
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <p className="font-display text-2xl uppercase text-gold">
              BhootKosh
            </p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/85">
            The illustrated archive of Indian ghosts, spirits, demons, haunted
            places, and folklore. Documented for cultural study and respectful
            regional research.
          </p>
        </div>
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-gold">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm font-medium text-cream/90">
            <li>
              <Link href="/ghosts" className="hover:text-gold">
                Ghost Encyclopedia
              </Link>
            </li>
            <li>
              <Link href="/haunted-places" className="hover:text-gold">
                Haunted Places
              </Link>
            </li>
            <li>
              <Link href="/stories" className="hover:text-gold">
                Folklore Stories
              </Link>
            </li>
            <li>
              <Link href="/regions" className="hover:text-gold">
                Regions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-gold">
            Archive
          </p>
          <ul className="mt-3 space-y-2 text-sm font-medium text-cream/90">
            <li>
              <Link href="/submit" className="hover:text-gold">
                Submit a Legend
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t-[3px] border-gold/30 py-3 text-center text-xs font-bold uppercase tracking-wider text-cream/55">
        © {new Date().getFullYear()} BhootKosh · Indian Folklore Archive
      </div>
    </footer>
  );
}
