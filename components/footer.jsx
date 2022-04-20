import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer aria-label="Ricks List Footer">
      <Link href="/" passHref>
        <a>
          <Image src="/RicksListLogo.png" width={1676} height={870} layout="responsive" alt="Rick's List Footer Logo" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/*<img src="/RicksListLogoFooter.png" alt="Ricks List Homepage" height="25%" width="25%"/>*/}
        </a>
      </Link>
    </footer>
  );
}