import { getData, setData } from './dataStore';

/**
  * <Resets the internal data of the application to its initial state>
  *
  * @param {} - N/A.
  *
  * @returns {} - N/A.
*/

export function clearV1() {
  const currentData = getData();

  currentData.Users = [];
  currentData.Channels = [];
  currentData.Dms = [];
  currentData.WorkSpace = {
    channelsExist: [],
    dmsExist: [],
    messagesExist: []
  };

  setData(currentData);
}
