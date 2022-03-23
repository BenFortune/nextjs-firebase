import Link from 'next/link';
import {monthsMap} from '../constants/months-map';
import styles from '../styles/Dropdown.module.css';
import cn from 'classnames';

export default function Dropdown({stateName, isOpen}) {

  return (

    <ul className={cn(styles['rl-dropdown'], {
      [styles.open]: isOpen,
      [styles.closed]: !isOpen
    })} aria-label={`ricks list ${stateName} fliers by month`} data-testid={`${stateName}-month-dropdown`}>
      {Object.values(monthsMap).map((month) => (
        <li key={month}>
          <Link href="/event-fliers/[statename]"
            as={`/event-fliers/${stateName}/${month}`}><a>{month}</a></Link>
        </li>
      ))}
    </ul>
  );
}