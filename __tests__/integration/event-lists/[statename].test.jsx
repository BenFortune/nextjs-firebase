import {queryByText, render, screen, within} from '@testing-library/react';
import EventLists from '../../../pages/event-lists/[statename]';
import Chance from 'chance';

const chance = new Chance();
function buildEventList() {
  return {
    date: chance.date({string: true}),
    month: chance.month(),
    name: chance.string(),
    time: chance.string(),
    address: chance.string(),
    city: chance.string(),
    state: chance.string(),
    contact: chance.phone(),
    memo: chance.string(),
    image: chance.string(),
    createdAt: chance.string(),
    updatedAt: chance.string()
  };
}

describe('Integration : State Event List', () => {
  it('should render a header', () => {
    const givenProps = {
      stateName: chance.string(),
      eventList: chance.n(buildEventList, chance.d6())
    };

    const {getByRole} = render(<EventLists {...givenProps}/>);

    const header = getByRole('banner');

    expect(header).toBeInTheDocument();
  });

  it('should render a footer', () => {
    const givenProps = {
      stateName: chance.string(),
      eventList: chance.n(buildEventList, chance.d6())
    };

    const {getByRole} = render(<EventLists {...givenProps}/>);

    const footer = getByRole('contentinfo',{
      name: 'Ricks List Footer'
    });

    expect(footer).toBeInTheDocument();
  });

  describe('when eventList prop is populated', () => {
    it('should render an event list table', () => {
      const givenProps = {
        stateName: chance.string(),
        eventList: chance.n(buildEventList, chance.d6()),
        showErrorMessage: false
      };

      render(<EventLists {...givenProps} />);
      const eventListTable = screen.getByRole('table');
      const tableHeader = screen.getByRole('rowgroup', {
        name: 'event-list-table-header'
      });
      const tableHeaderCells = screen.getAllByRole('columnheader');
      const tableBody = screen.getByRole('rowgroup', {
        name: 'event-list-table-body'
      });
      const {getAllByRole} = within(tableBody);
      const tableBodyRows = getAllByRole('row');

      expect(screen.queryByText('There was an error retrieving these events. Please try again later.')).toBeNull();
      expect(eventListTable).toBeInTheDocument();
      expect(tableHeader).toBeInTheDocument();
      expect(tableHeaderCells.length).toEqual(8);
      expect(tableBodyRows.length).toEqual(givenProps.eventList.length);

      tableBodyRows.forEach((tableRow, index) => {
        const {getAllByRole} = within(tableRow);
        const tableCells = getAllByRole('cell');
        expect(tableCells[0].textContent).toEqual(givenProps.eventList[index].date);
        expect(tableCells[1].textContent).toEqual(givenProps.eventList[index].name);
        expect(tableCells[2].textContent).toEqual(givenProps.eventList[index].time);
        expect(tableCells[3].textContent).toEqual(givenProps.eventList[index].address);
        expect(tableCells[4].textContent).toEqual(givenProps.eventList[index].city);
        expect(tableCells[5].textContent).toEqual(givenProps.eventList[index].state);
        expect(tableCells[6].textContent).toEqual(givenProps.eventList[index].contact);
        expect(tableCells[7].textContent).toEqual(givenProps.eventList[index].memo);
      });
    });
  });

  describe('when eventList prop is empty and error prop is false', () => {
    it('should render an events not found message', () => {
      const givenProps = {
        stateName: chance.string(),
        eventList: [],
        showErrorMessage: false
      };

      const {queryByTestId, queryByText} = render(<EventLists {...givenProps} />);

      expect(queryByText('There was an error retrieving these events. Please try again later.')).toBeNull();
      expect(queryByTestId('event-list-table')).toBeNull();
      expect(queryByText('No events found.')).toBeInTheDocument();
    });
  });

  describe('when eventList prop is empty and error prop is true', () => {
    it('should render an error message', () => {
      const givenProps = {
        stateName: chance.string(),
        eventList: [],
        showErrorMessage: true
      };

      const {queryByTestId, queryByText} = render(<EventLists {...givenProps} />);

      expect(queryByTestId('event-list-table')).toBeNull();
      expect(queryByText('No events found.')).toBeNull();
      expect(queryByText('There was an error retrieving these events. Please try again later.')).toBeInTheDocument();
    });
  });
});