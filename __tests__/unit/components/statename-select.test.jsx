import {render, within} from '@testing-library/react';
import StatenameSelect from '../../../components/statename-select';
import {stateNameList} from '../../../constants/state-names';

describe('Unit : State Name Select', () => {
  it('should render a state select dropdown', () => {
  	const {getByRole, getByLabelText} = render(<StatenameSelect/>);

    const stateSelect = getByRole('combobox');
    const {getAllByRole} = within(stateSelect);
    const stateNameOptions = getAllByRole('option');

    expect(getByLabelText('State')).toBeInTheDocument();
    expect(stateNameOptions.length).toEqual(6);

    stateNameOptions.forEach((stateNameOption, index) => {
      const expectedStateNameAbbreviation = stateNameList[index].abbreviation;
      const expectedStateNameFullName = stateNameList[index].fullName;

      expect(stateNameOption.textContent).toEqual(expectedStateNameAbbreviation);
      expect(stateNameOption).toHaveAttribute('name', expectedStateNameFullName);
      expect(stateNameOption).toHaveAttribute('value', expectedStateNameFullName);
    });
  });
});