import React from 'react';
import {render, screen, within} from '@testing-library/react';
import Dropdown from '../../../components/dropdown';
import {monthsMap} from '../../../constants/months-map';
import Chance from 'chance';

const chance = new Chance();

describe('Unit : Dropdown', () => {
  it('should render', () => {
    const givenStateName = chance.string();

    render(<Dropdown stateName={givenStateName} />);

    const list = screen.getByRole('list', {
	    name: `ricks list ${givenStateName} fliers by month`,
    });

    expect(list).toBeInTheDocument();
  });

  it('should render a list of month links', () => {
    const givenStateName = chance.string();

    render(<Dropdown stateName={givenStateName}/>);

    const list = screen.getByRole('list', {
	    name: `ricks list ${givenStateName} fliers by month`,
    });
    const { getAllByRole } = within(list);
    const months = getAllByRole('listitem');
    const monthNames = months.map((item) => item.textContent);
    const expectedMonths = Object.keys(monthsMap);

    expect(monthNames.length).toBe(12);
    monthNames.forEach((monthName, index) => {
      const expectedMonthName = monthsMap[expectedMonths[index]];
      const monthLink = screen.getByText(expectedMonthName);

      expect(monthLink).toHaveAttribute('href', `/event-fliers/${givenStateName}/${expectedMonthName}`);
    });
  });
});
