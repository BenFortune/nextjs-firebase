import {render, screen, within} from '@testing-library/react';
import EventButtonsList from '../../../components/event-buttons-list';
import {stateNameList} from '../../../constants/state-names';

describe('Unit : Event Buttons List', () => {
  it('should render the event button list component', () => {
    render(<EventButtonsList />);

    const eventButtonList = screen.getByRole('list');

    expect(eventButtonList).toBeInTheDocument();
  });

  it('should render a list of buttons', () => {
    render(<EventButtonsList />);

    const eventButtonList = screen.getByRole('list');
    const { getAllByRole } = within(eventButtonList);
    const stateEventListItems = getAllByRole('listitem');

    expect(stateEventListItems.length).toEqual(6);

    stateEventListItems.forEach((stateEventListItem, index) => {
      const expectedStateName = stateNameList[index].fullName;

      expect(stateEventListItem.textContent).toEqual(`${expectedStateName} Events`);

      const eventLink = screen.getByRole('link', {
        name: `${expectedStateName} Events`
      });

      expect(eventLink).toHaveAttribute('href', `/event-lists/${expectedStateName}`);
    });
  });
});