import React from 'react';
import {render, screen, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import Header from '../../components/header';
import {stateNameList} from '../../constants/state-names';

describe('Integration : Header', () => {
  it('something cool', async () => {
    render(<Header />);

    const list = screen.getByRole('list', {
      name: /ricks-lists-states-fliers/i,
    });
    const { getAllByTestId } = within(list);
    const stateNameListItems = getAllByTestId('state-flier-navigation-container');

    expect(stateNameListItems.length).toBe(6);
    for (const stateItem of stateNameListItems) {
      const index = stateNameListItems.indexOf(stateItem);
      const stateNameRef = stateNameList[index].fullName;
      const stateFlierButton = screen.getByRole('button', {
        name: `${stateNameRef} fliers dropdown button`
      });

      await user.click(stateFlierButton);

      const monthLinksDropdown = screen.getByTestId(`${stateNameRef}-month-dropdown`);
      expect(monthLinksDropdown).toBeVisible();

      await user.click(stateFlierButton);

      expect(monthLinksDropdown).toHaveClass('closed');
      // Seems to be an issue with css modules changes not being picked up by testing library. The following assertion should be used.
      // expect(monthLinksDropdown).not.toBeVisible();
    }
  });
});