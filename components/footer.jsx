import Link from 'next/link';

export default function Footer() {
  return (
    <footer aria-label="Ricks List Footer">
      <Link href="/" passHref>
        <a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/RicksListLogoFooter.png" alt="Ricks List Homepage" height="25%" width="25%"/>
        </a>
      </Link>
    </footer>
  );
}