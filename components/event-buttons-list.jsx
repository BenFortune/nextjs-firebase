import {stateNameList} from '../constants/state-names';
import Link from 'next/link';

export default function EventButtonsList() {
  return (
    <ul>
      {stateNameList.map((stateName) => {
        return (
          <li key={stateName.fullName}>
            <Link href="/event-lists/[statename]"
              as={`/event-lists/${stateName.fullName}`} passHref><a>{stateName.fullName} Events</a></Link>
          </li>
        );
      })}
    </ul>
  );
}