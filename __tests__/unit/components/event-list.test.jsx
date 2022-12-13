import {screen, render, within, queryByTestId} from '@testing-library/react';
import EventList from '../../../components/event-list';
import Chance from 'chance';

const chance = new Chance();

function buildEventList(numberOfEvents) {
  return [{
    month: chance.month(),
    list: chance.n(() => ({
      date: chance.date({string: true}),
      name: chance.string(),
      time: chance.string(),
      address: chance.string(),
      city: chance.string(),
      state: chance.string(),
      contact: chance.phone(),
      memo: chance.string(),
      imageSrc: chance.string()
    }), numberOfEvents)
  }];
}

describe('Unit : Event List', () => {
  let givenProps, expectedNumberOfEvents;

  describe('when event list is populated', () => {
    beforeEach(() => {
      expectedNumberOfEvents = chance.d6();
      givenProps = {
        stateName: chance.string(),
        eventList: buildEventList(expectedNumberOfEvents)
      };
    });

    it('should not render a message saying no events found', () => {
      const {queryByText} = render(<EventList {...givenProps}/>);

      expect(queryByText('No events found.')).toBeNull();
    });

    it('should render the table container', () => {
      const {getByRole} = render(<EventList {...givenProps} />);

      const table = getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should render a table header', () => {
      render(<EventList {...givenProps} />);

      const tableHeader = screen.getByRole('rowgroup', {
        name: 'event-list-table-header'
      });
      const {getByRole} = within(tableHeader);
      const tableHeaderRow = getByRole('row');
      const {getAllByRole} = within(tableHeaderRow);

      const tableHeaderCells = getAllByRole('columnheader');

      expect(tableHeaderCells.length).toEqual(8);
      expect(tableHeaderCells[0].textContent).toEqual('Date');
      expect(tableHeaderCells[1].textContent).toEqual('Event Name');
      expect(tableHeaderCells[2].textContent).toEqual('Event Time');
      expect(tableHeaderCells[3].textContent).toEqual('Event Address');
      expect(tableHeaderCells[4].textContent).toEqual('Event City');
      expect(tableHeaderCells[5].textContent).toEqual('Event State');
      expect(tableHeaderCells[6].textContent).toEqual('Contact');
      expect(tableHeaderCells[7].textContent).toEqual('Memo');
    });

    it('should render a table body', () => {
      render(<EventList {...givenProps}/>);

      const tableBody = screen.getByRole('rowgroup', {
        name: 'event-list-table-body'
      });
      const {getAllByRole} = within(tableBody);
      const tableBodyRows = getAllByRole('row');

      expect(tableBodyRows.length).toEqual(expectedNumberOfEvents + 1);
    });
  });

  describe('when event list is not populated', () => {
    beforeEach(() => {
      givenProps = {
        stateName: chance.string(),
        eventList: []
      };
    });

    it('should not render a table', () => {
      const {queryByTestId} = render(<EventList {...givenProps} />);

      expect(queryByTestId('event-list-table')).toBeNull();
    });

    it('should render a message saying no events found', () => {
      const {getByText} = render(<EventList {...givenProps}/>);

      expect(getByText('No events found.')).toBeInTheDocument();
    });
  });
});