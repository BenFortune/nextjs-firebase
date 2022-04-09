import Navigation from './navigation';

export default function Header() {
  return (
    <header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/RicksListLogo.png" alt="Rick's List Logo" height="25%" width="25%"/>
      <Navigation/>
    </header>
  );
}