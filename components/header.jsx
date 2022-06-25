import Image from 'next/image';
import Navigation from './navigation';

export default function Header() {
  return (
    <header>
      <Image src="/RicksListLogo.png" width={1676} height={870} layout="responsive" priority={true} alt="Rick's List Header Logo"/>
      <Navigation/>
    </header>
  );
}