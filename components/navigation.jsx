import React, {useState} from 'react';
import {stateNameList} from '../constants/state-names';
import Dropdown from './dropdown';

export default function Navigation() {
  const [visibleIndex, updateVisibleIndex] = useState(null);

  return (
    <nav>
      <ul aria-label="ricks-lists-states-fliers">
        {stateNameList.map((state, index) => (
          <React.Fragment key={state.abbreviation}>
            <li key={state.abbreviation} aria-label={`${state.fullName} dropdown container`} data-testid={'state-flier-navigation-container'}>
              <button type="button" aria-label={`${state.fullName} fliers dropdown button`} data-testid={'dropdown-button'} onClick={() => {
                const isOpenOrClosed = visibleIndex === index ? null : index;
                updateVisibleIndex(isOpenOrClosed);
              }}>
                {state.fullName} fliers
              </button>
              <Dropdown stateName={state.fullName} isOpen={visibleIndex === index}/>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}