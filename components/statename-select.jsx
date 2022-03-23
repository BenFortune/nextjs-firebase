import {stateNameList} from '../constants/state-names';

export default function StatenameSelect() {
  return (
    <>
      <label htmlFor="event-state">State</label>
      <select name="select" id="event-state">
        {stateNameList.map((stateName) => (
          <option name={stateName.abbreviation} key={stateName.fullName}>{stateName.abbreviation}</option>
        ))}
      </select>
    </>
  );
}
