/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Navigation from '../../../components/navigation';
import {stateNameList} from '../../../constants/state-names';

describe('Unit : Navigation', () => {
  it('should render navigation', () => {
    render(<Navigation />);

    const navigation = screen.getByRole('navigation');

    expect(navigation).toBeInTheDocument();
  });

  it('should render list of state name links', () => {
    render(<Navigation />);

    const list = screen.getByRole('list', {
      name: /ricks-lists-states-fliers/i,
    });
    const { getAllByTestId } = within(list);
    const stateItems = getAllByTestId('dropdown-button');
    const stateNames = stateItems.map(item => item.textContent);

    expect(stateItems.length).toBe(6);
    stateNames.forEach((stateName, index) => {
      const dropdownButton = screen.getByRole('button', {
        name: `${stateName} dropdown button`
      });

      expect(dropdownButton.textContent).toEqual(`${stateNameList[index].fullName} fliers`);
      expect(dropdownButton).toHaveAttribute('type', 'button');
    });
  });
});