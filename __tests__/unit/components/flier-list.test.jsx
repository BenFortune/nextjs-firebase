import {render, within} from '@testing-library/react';
import FlierList from '../../../components/flier-list';
import Chance from 'chance';

const chance = new Chance();
function buildFlierList() {
  return {
    [chance.string()]: chance.string(),
    imageSrc: chance.url(),
    name: chance.string()
  };
}

describe('Unit : FlierList', () => {
  let givenProps;

  describe('when event list is populated', () => {
    it('should render a list of fliers', () => {
      givenProps = {
        flierList: chance.n(buildFlierList, chance.d6())
      };

      const {getByRole} = render(<FlierList {...givenProps}/>);
      const flierList = getByRole('list', {
        name: 'ricks-list-flier-list'
      });

      const {getAllByRole} = within(flierList);
      const flierItems = getAllByRole('listitem');

      expect(flierItems.length).toEqual(givenProps.flierList.length);
      flierItems.forEach((flierItem, index) => {
        const {getByRole} = within(flierItem);
        const flierImage = getByRole('img');

        expect(flierImage).toHaveAttribute('src', givenProps.flierList[index].imageSrc);
        expect(flierImage).toHaveAttribute('alt', givenProps.flierList[index].name);
      });
    });
  });

  describe('when event list is not populated', () => {
    it ('should render a message saying no fliers found', () => {
      givenProps = {
        flierList: []
      };

      const {queryByRole, getByText} = render(<FlierList {...givenProps} />);
      const flierList = queryByRole('list', {
        name: 'ricks-list-flier-list'
      });

      expect(flierList).toBeNull();
      expect(getByText('No Fliers Found')).toBeInTheDocument();
    });
  });
});