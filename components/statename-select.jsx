import {stateNameList} from '../constants/state-names';

export default function StatenameSelect() {
  return (
    <>
      <label htmlFor="event-state">State</label>
      <select name="state" id="event-state">
        {stateNameList.map((stateName) => (
          <option name={stateName.fullName} key={stateName.abbreviation} value={stateName.fullName}>{stateName.abbreviation}</option>
        ))}
      </select>
    </>
  );
}
