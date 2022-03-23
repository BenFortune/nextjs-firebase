import {render, within} from '@testing-library/react';
import Chance from 'chance';
import EventFliersByState from '../../../pages/event-fliers/[statename]';

const chance = new Chance();
function buildFlierList() {
  return {
    [chance.string()]: chance.string(),
    name: chance.word(),
    imageSrc: chance.url()
  };
}

describe('Integration : Event Fliers By State', () => {
  it('should render a header', () => {
    const givenProps = {
      stateName: chance.string(),
      flierList: chance.n(buildFlierList, chance.d8()),
      showErrorMessage: false
    };

    const {getByRole} = render(<EventFliersByState {...givenProps}/>);
    const header = getByRole('banner');

    expect(header).toBeInTheDocument();
  });

  it('should render a footer', () => {
    const givenProps = {
      stateName: chance.string(),
      flierList: chance.n(buildFlierList, chance.d8()),
      showErrorMessage: false
    };

    const {getByRole} = render(<EventFliersByState {...givenProps}/>);

    // TODO FIGURE OUT WHY FOOTER SEEMS TO BE RENDERED TWICE
    const footer = getByRole('contentinfo',{
      name: 'Ricks List Footer'
    });

    expect(footer).toBeInTheDocument();
  });

  it('should render a heading', () => {
    const givenProps = {
      stateName: chance.string(),
      flierList: chance.n(buildFlierList, chance.d8()),
      showErrorMessage: false
    };

    const {getByRole} = render(<EventFliersByState {...givenProps}/>);
    const heading = getByRole('heading', {
      level: 1
    });

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual(`Ricks List ${givenProps.stateName} Event Fliers`);
  });

  describe('when flier list is populated', () => {
    it('should render a list of fliers', () => {
      const givenProps = {
        stateName: chance.string(),
        flierList: chance.n(buildFlierList, chance.d8()),
        showErrorMessage: false
      };

      const {getByRole} = render(<EventFliersByState {...givenProps}/>);
      const flierList = getByRole('list', {
        name: 'ricks-list-flier-list'
      });
      const {getAllByRole} = within(flierList);
      const flierItems = getAllByRole('listitem');

      expect(flierItems.length).toEqual(givenProps.flierList.length);
      flierItems.forEach((flierItem, index) => {
        const {getByRole} = within(flierItem);
        const image = getByRole('img');

        expect(image).toHaveAttribute('src', givenProps.flierList[index].imageSrc);
        expect(image).toHaveAttribute('alt', givenProps.flierList[index].name);
      });
    });
  });

  describe('when flier list is empty and error prop is false', () => {
    it('should do something', () => {
      const givenProps = {
        stateName: chance.string(),
        flierList: [],
        showErrorMessage: false
      };

      const {queryByRole, queryByText} = render(<EventFliersByState {...givenProps}/>);
      const flierList = queryByRole('list', {
        name: 'ricks-list-flier-list'
      });
      const errorElement = queryByText('There was an error retrieving fliers. Please try again later');
      const emptyFlierListElement = queryByText('No Fliers Found');

      expect(flierList).toBeNull();
      expect(errorElement).toBeNull();
      expect(emptyFlierListElement).toBeInTheDocument();
    });
  });

  describe('when flier list is empty and error prop is true', () => {
    it('should display an error message', () => {
      const givenProps = {
        stateName: chance.string(),
        flierList: [],
        showErrorMessage: true
      };

      const {queryByText, queryByRole} = render(<EventFliersByState {...givenProps}/>);
      const errorElement = queryByText('There was an error retrieving fliers. Please try again later');
      const flierList = queryByRole('list', {
        name: 'ricks-list-flier-list'
      });

      expect(errorElement).toBeInTheDocument();
      expect(flierList).toBeNull();
    });
  });
});