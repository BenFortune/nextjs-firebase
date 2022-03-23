import Navigation from './navigation';

export default function Header() {
  return (
    <header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/RicksListLogo.png" alt="Rick's List Logo"/>
      <Navigation/>
    </header>
  );
}