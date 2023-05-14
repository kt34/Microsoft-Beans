import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

function isAlphaNumeric(str) {
  let code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
}
/**
  * <checkValidToken check if the token is valid>
  *
  * @param {String} token - String token
  * ...
  *
  * @returns {boolean} - true or false
 */
export function checkValidToken(token: string) {
  const currentData = getData();

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        return true;
      }
    }
  }

  return false;
}

/**
  * <checkDuplicates check if there are duplicates in an array of integers>
  *
  * @param {Array[Numbers]} arr - array of integers
  * ...
  *
  * @returns {boolean} - true or false
 */

function checkDuplicates(arr: any) {
  const toFindDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
  const duplicateElements = toFindDuplicates(arr);

  if (duplicateElements.length === 0) {
    return false;
  }

  return true;
}

/**
  * <createname creates the name for dmCreateV1 with an array of names>
  *
  * @param {Array[strings]} arr - array of strings
  * ...
  *
  * @returns {string} - string of the final name combined
 */

function createName(array: any) {
  const finalArray = array.sort();
  let finalName = finalArray[0];

  for (let i = 1; i < finalArray.length; i++) {
    finalName = finalName.concat(', ');
    finalName = finalName.concat(finalArray[i]);
  }

  return finalName;
}

/**
  * <dmIdValid check if the dmis valid and if not change it>
  *
  * @param {number} dmId - the given dmId
  * ...
  *
  * @returns {number} - finaldmid
 */
function dmIdValid(dmId: number) {
  const currentData = getData();

  let finalDmId = dmId;

  let validId = 0;

  while (validId !== 1) {
    let validIdFlag = 0;
    for (let i = 0; i < currentData.Dms.length; i++) {
      if (finalDmId === currentData.Dms[i].dmId) {
        finalDmId++;
        validIdFlag = 1;
      }
    }

    if (validIdFlag === 0) {
      validId = 1;
    }
  }

  return finalDmId;
}
/**
  * <dmCreateV2 creates a new dm given the array of people in the dm>
  *
  * @param {string} token - the given randomly generated string for usersession
  * @param {array} uids - the array uids of given users
  * ...
  *
  * @returns {number} dmId - integer for dmId to represent each dm
 */

export function dmCreateV2(token: string, uIds: any) {
  const currentData = getData();

  // check if the token is valid first
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  // check if there are duplicates in the arry
  if (checkDuplicates(uIds)) {
    throw HTTPError(400, 'error');
  }

  // check if any uid does not refer to a valid uid
  let validUid = 0;
  for (let i = 0; i < uIds.length; i++) {
    for (let j = 0; j < currentData.Users.length; j++) {
      if (uIds[i] === currentData.Users[j].uId) {
        validUid++;
      }
    }
  }
  if (validUid !== uIds.length) {
    throw HTTPError(400, 'error');
  }

  // now everything is valid

  // find out who the owner is through the token
  let ownerUid;
  let ownerHandleStr;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        ownerUid = currentData.Users[i].uId;
        ownerHandleStr = currentData.Users[i].handleStr;
      }
    }
  }

  // create an array of the uids names
  const arrNames = [];
  for (let i = 0; i < uIds.length; i++) {
    for (let j = 0; j < currentData.Users.length; j++) {
      if (uIds[i] === currentData.Users[j].uId) {
        arrNames.push(currentData.Users[j].handleStr);
      }
    }
  }

  let dmId = currentData.Dms.length;

  // check if the dmid is already taken after a dmRemove
  dmId = dmIdValid(dmId);

  // push the owner name into the array and create the final name
  arrNames.push(ownerHandleStr);
  const name = createName(arrNames);

  const finalMembers = [];
  // push members and then owner
  for (let i = 0; i < uIds.length; i++) {
    finalMembers.push(uIds[i]);
  }
  finalMembers.push(ownerUid);
  const timeStamp = Math.floor((new Date()).getTime() / 1000);

  const dmInfo = {
    dmId: dmId,
    name: name,
    owner: ownerUid,
    members: finalMembers,
    messages: [],
    timeStamp: timeStamp
  };

  currentData.Dms.push(dmInfo);

  // update global data for workspacesStats
  const index = currentData.WorkSpace.dmsExist.length - 1;
  const newNumsDmsExist = currentData.WorkSpace.dmsExist[index].numDmsExist + 1;
  const dmsExistData = {
    numDmsExist: newNumsDmsExist,
    timeStamp: timeStamp
  };
  currentData.WorkSpace.dmsExist.push(dmsExistData);

  // update user data for dms joined
  for (let i = 0; i < currentData.Users.length; i++) {
    if (ownerUid === currentData.Users[i].uId) {
      const indexUser = currentData.Users[i].dmsJoined.length - 1;
      const newNumDmsJoined = currentData.Users[i].dmsJoined[indexUser].numDmsJoined + 1;
      const dmsJoinedData = {
        numDmsJoined: newNumDmsJoined,
        timeStamp: timeStamp
      };
      currentData.Users[i].dmsJoined.push(dmsJoinedData);
      // update the notificaitons for the user
      const notificationOwnerData = {
        channelId: -1,
        dmId: dmId,
        messageSenderHandle: ownerHandleStr,
        type: 'addDm',
        message: -1
      };
      currentData.Users[i].notifications.push(notificationOwnerData);
    }
  }

  for (let i = 0; i < uIds.length; i++) {
    for (let j = 0; j < currentData.Users.length; j++) {
      if (uIds[i] === currentData.Users[j].uId) {
        const indexUser = currentData.Users[j].dmsJoined.length - 1;
        const newNumDmsJoined = currentData.Users[j].dmsJoined[indexUser].numDmsJoined + 1;
        const dmsJoinedData = {
          numDmsJoined: newNumDmsJoined,
          timeStamp: timeStamp
        };
        currentData.Users[j].dmsJoined.push(dmsJoinedData);
        const notificationUserData = {
          channelId: -1,
          dmId: dmId,
          messageSenderHandle: ownerHandleStr,
          type: 'addDm',
          message: -1
        };
        currentData.Users[j].notifications.push(notificationUserData);
      }
    }
  }

  setData(currentData);

  return { dmId: dmId };
}

/**
  * <dmListV2 lists all the dms>
  *
  * @param {string} token - the given randomly generated string for usersession
  * ...
  *
  * @returns {array} dms - returns array of dms
 */

export function dmListV2(token: any) {
  const currentData = getData();

  // check if the token is valid
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  // find the owner of the token
  let ownerUid;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        ownerUid = currentData.Users[i].uId;
      }
    }
  }

  const finalArray = [];
  for (let i = 0; i < currentData.Dms.length; i++) {
    // check if he is in the members
    for (let j = 0; j < currentData.Dms[i].members.length; j++) {
      if (ownerUid === currentData.Dms[i].members[j]) {
        const dmData = {
          dmId: i,
          name: currentData.Dms[i].name
        };
        finalArray.push(dmData);
      }
    }
  }

  return { dms: finalArray };
}

/**
  * <dmRemoveV2 removes an entire dm>
  *
  * @param {string} token - the given randomly generated string for usersession
  * @param {number} dmId - the dmId of a certain dm
  * ...
  *
  * @returns {}
 */

export function dmRemoveV2(token: any, dmId: number) {
  const currentData = getData();

  // check if token is valid
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  // check if dm refers to a valid dm
  let validDm = 0;
  let finalDm;
  let index;
  let messagesAmount;
  for (let i = 0; i < currentData.Dms.length; i++) {
    if (dmId === currentData.Dms[i].dmId) {
      validDm = 1;
      finalDm = currentData.Dms[i];
      index = i;
      messagesAmount = currentData.Dms[i].messages.length;
    }
  }

  if (validDm === 0) {
    throw HTTPError(400, 'error');
  }

  // check if the authorised owner is the dm creator
  let authUserId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        authUserId = currentData.Users[i].uId;
      }
    }
  }

  if (authUserId !== finalDm.owner) {
    throw HTTPError(403, 'error');
  }
  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  // update user stats
  for (let i = 0; i < currentData.Dms[index].members.length; i++) {
    for (let j = 0; j < currentData.Users.length; j++) {
      if (currentData.Dms[index].members[i] === currentData.Users[j].uId) {
        const indexUser = currentData.Users[j].dmsJoined.length - 1;
        const newNumDmsJoined = currentData.Users[j].dmsJoined[indexUser].numDmsJoined - 1;
        const dmsJoinedData = {
          numDmsJoined: newNumDmsJoined,
          timeStamp: timeStamp
        };
        currentData.Users[j].dmsJoined.push(dmsJoinedData);
      }
    }
  }

  // update the global messages stats
  const indexMessages = currentData.WorkSpace.messagesExist.length - 1;
  const numMessagesExist = currentData.WorkSpace.messagesExist[indexMessages].numMessagesExist - messagesAmount;
  const messagesExistData = {
    numMessagesExist: numMessagesExist,
    timeStamp: timeStamp
  };
  currentData.WorkSpace.messagesExist.push(messagesExistData);
  // must be valid now
  currentData.Dms.splice(index, 1);

  // update global data for workspacesStats
  const indexRemove = currentData.WorkSpace.dmsExist.length - 1;
  const newNumsDmsExist = currentData.WorkSpace.dmsExist[indexRemove].numDmsExist - 1;
  const dmsExistData = {
    numDmsExist: newNumsDmsExist,
    timeStamp: timeStamp
  };
  currentData.WorkSpace.dmsExist.push(dmsExistData);

  setData(currentData);

  return {};
}

/**
  * <dmDetailsV2 gives the details of a certain dm>
  *
  * @param {string} token - the given randomly generated string for usersession
  * @param {number} dmId - the dmId of a certain dm
  * ...
  *
  * @returns {string} - name of the dm
  * @returns {array} - returns objects of all members
 */

export function dmDetailsV2(token: any, dmId: number) {
  const currentData = getData();

  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  let authUserId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        authUserId = currentData.Users[i].uId;
      }
    }
  }

  // check if dmid is valid
  let validDmId = 0;
  let validMember = 0;
  let dmName;
  let dmIndex;
  for (let i = 0; i < currentData.Dms.length; i++) {
    if (currentData.Dms[i].dmId === dmId) {
      dmName = currentData.Dms[i].name;
      validDmId = 1;
      dmIndex = i;
      for (let j = 0; j < currentData.Dms[i].members.length; j++) {
        if (currentData.Dms[i].members[j] === authUserId) {
          validMember = 1;
        }
      }
    }
  }

  if (validDmId === 0) {
    throw HTTPError(400, 'error');
  }
  if (validMember === 0) {
    throw HTTPError(403, 'error');
  }

  // now everything is valid
  const finalArrMembers = [];

  for (let i = 0; i < currentData.Dms[dmIndex].members.length; i++) {
    for (let j = 0; j < currentData.Users.length; j++) {
      if (currentData.Dms[dmIndex].members[i] === currentData.Users[j].uId) {
        const memberDetails = {
          uId: currentData.Users[j].uId,
          email: currentData.Users[j].email,
          nameFirst: currentData.Users[j].nameFirst,
          nameLast: currentData.Users[j].nameLast,
          handleStr: currentData.Users[j].handleStr
        };
        finalArrMembers.push(memberDetails);
      }
    }
  }

  return {
    name: dmName,
    members: finalArrMembers
  };
}

/**
  * <dmLeaveV2 removes a user from a dm>
  *
  * @param {string} token - the given randomly generated string for usersession
  * @param {number} dmId - the dmId of a certain dm
  * ...
  *
  * @returns {}
 */

export function dmLeaveV2(token: any, dmId: any) {
  const currentData = getData();

  // check if token is valid
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  let authUserId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        authUserId = currentData.Users[i].uId;
      }
    }
  }

  // check if dmid is valid
  let validDmId = 0;
  let validMember = 0;
  let dmTemp;
  for (let i = 0; i < currentData.Dms.length; i++) {
    if (currentData.Dms[i].dmId === dmId) {
      dmTemp = currentData.Dms[i];
      validDmId = 1;
      for (let j = 0; j < currentData.Dms[i].members.length; j++) {
        if (currentData.Dms[i].members[j] === authUserId) {
          validMember = 1;
        }
      }
    }
  }

  if (validDmId === 0) {
    throw HTTPError(400, 'error');
  }
  if (validMember === 0) {
    throw HTTPError(403, 'error');
  }

  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  // update the userStats for that persom
  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].uId === authUserId) {
      const indexUser = currentData.Users[i].dmsJoined.length - 1;
      const newNumDmsJoined = currentData.Users[i].dmsJoined[indexUser].numDmsJoined - 1;
      const dmsJoinedData = {
        numDmsJoined: newNumDmsJoined,
        timeStamp: timeStamp
      };
      currentData.Users[i].dmsJoined.push(dmsJoinedData);
    }
  }

  // removes uid of member
  for (let i = 0; i < dmTemp.members.length; i++) {
    if (authUserId === dmTemp.members[i]) {
      dmTemp.members.splice(i, 1);
    }
  }

  // removes uId of owner

  if (authUserId === dmTemp.owner) {
    dmTemp.owner.splice(0, 1);
  }

  setData(currentData);
  return {};
}

/**
  * < The 'messageSendDmV2' function has the purpose of sending a message to a DM. >
  *
  * @param { string } token - refers to the sessionId of the individual
  * who called the function.
  * @param { integer } dmId - refers to the unique ID of a specific DM.
  * @param { string } message - refers to the message being sent.
  * ...
  *
  * @returns { object } - returns an object that contains details of what the messageId is.
*/
export function messageSendDmV2(token: string, dmId: number, message: string) {
  // dataStore being used to store and retrieve data.
  const data = getData();

  // Used to store the index that the DM is located in.
  let dmIndex;
  // Used to store the index that the uId is located in for the token.
  let userIndex;

  // Checking if token is valid.
  let validToken = 0;
  let userHandleSent;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;
    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        validToken = 1;
        userHandleSent = data.Users[i].handleStr;
        userIndex = i;
      }
    }
  }
  if (validToken === 0) {
    throw HTTPError(403, 'Token invalid!');
  }

  // Checking if dmId exists.
  let result = false;

  for (let i = 0; i < data.Dms.length; i++) {
    if (data.Dms[i].dmId === dmId) {
      result = true;
      dmIndex = i;
    }
  }
  if (result !== true) {
    throw HTTPError(400, 'dmId does not exist!');
  }

  // Checking if authUserId of token is not a member of the DM.
  result = false;
  for (let i = 0; i < data.Dms[dmIndex].members.length; i++) {
    if (data.Dms[dmIndex].members[i] === data.Users[userIndex].uId) {
      result = true;
    }
  }
  if (result !== true) {
    throw HTTPError(403, 'Authorised user not apart of DM!');
  }

  // checking if message is too long or short.
  if (message.length > 1000 || message.length < 1) {
    throw HTTPError(400, 'Message not of right length!');
  }

  // Makes a messageId.
  const messageId = Math.floor((new Date()).getTime());

  // Gets the timestamp.
  const timeSent = Math.floor((new Date()).getTime() / 1000);

  const newData = {
    messageId: messageId,
    uId: data.Users[userIndex].uId,
    message: message,
    timeSent: timeSent,
    reacts: [
      {
        reactId: 1,
        uIds: [],
        isThisUserReacted: false
      }
    ],
    isPinned: false,
  };
  data.Dms[dmIndex].messages.push(newData);

  // user stats.
  const userMessagesIndex = data.Users[userIndex].messagesSent.length - 1;
  const userMessagesCurrently = data.Users[userIndex].messagesSent[userMessagesIndex].numMessagesSent;
  const userMessages = userMessagesCurrently + 1;
  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  const userData = {
    numMessagesSent: userMessages,
    timeStamp: timeStamp,
  };

  data.Users[userIndex].messagesSent.push(userData);

  // workspace stats.
  const workMsgsExistIndex = data.WorkSpace.messagesExist.length - 1;
  const workMsgsExistCurrently = data.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
  const workMsgsExist = workMsgsExistCurrently + 1;
  const workDataMsgs = {
    numMessagesExist: workMsgsExist,
    timeStamp: timeStamp,
  };
  data.WorkSpace.messagesExist.push(workDataMsgs);

  // notifications.
  const memberUids = [];
  for (let i = 0; i < data.Dms[dmIndex].members.length; i++) {
    memberUids.push(data.Dms[dmIndex].members[i]);
  }
  const memberNameWithAts = [];
  for (let i = 0; i < data.Users.length; i++) {
    for (let j = 0; j < memberUids.length; j++) {
      if (data.Users[i].uId === memberUids[j]) {
        memberNameWithAts.push('@' + data.Users[i].handleStr);
      }
    }
  }

  // final@ that are included in the message
  const finalAts = [];
  let isTag = false;
  let tag = '';
  for (let i = 0; i < memberNameWithAts.length; i++) {
    if (message.includes(memberNameWithAts[i])) {
      const stringIndex = message.search(memberNameWithAts[i]);
      const handleLength = memberNameWithAts[i].length;
      isTag = true;
      let j = stringIndex + (handleLength);
      tag = memberNameWithAts[i];
      while (isTag === true && j < message.length) {
        if (isAlphaNumeric(message[j])) {
          tag = tag + message[j];
        } else {
          isTag = false;
        }
        j++;
      }
      finalAts.push(tag);
    }
  }

  for (let i = 0; i < data.Users.length; i++) {
    for (let j = 0; j < finalAts.length; j++) {
      const newHandleStr = '@' + data.Users[i].handleStr;
      if (finalAts[j] === newHandleStr) {
        const notificationData = {
          channelId: -1,
          dmId: dmId,
          messageSenderHandle: userHandleSent,
          type: 'tagDm',
          message: message
        };
        data.Users[i].notifications.push(notificationData);
      }
    }
  }
  setData(data);

  return {
    messageId: messageId,
  };
}

/**

  * < The 'dmMessagesV2' function has the purpose returning upto 50 messages. >

  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } dmId - refers to the unique ID of a specific DM.
  * @param { integer } start - refers to the initial index at which the first message is sent.
  * ...

  * @returns { Array of Objects } - returns an array of objects containing details about the
  * messages such as messageId, uId, message, timeSent as well as the start and end.

*/
export function dmMessagesV2(token: string, dmId: number, start: number) {
  // dataStore being used to store and retrieve data.

  const data = getData();

  const messages = [];

  let end = 0;

  // Used to store the index that the channel is located in.

  let dmIndex;

  // Used to store the index that the uId is located in for the token.

  let userIndex;

  // Case when start is negative.

  if (start < 0) {
    throw HTTPError(400, 'Start value can not be negative!');
  }

  // Checking if token is valid.

  let result = false;
  let uId;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;

    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        result = true;
        uId = data.Users[i].uId;

        userIndex = i;
      }
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Token invalid!');
  }

  // Checking if dmId exists.

  result = false;

  for (let i = 0; i < data.Dms.length; i++) {
    if (data.Dms[i].dmId === dmId) {
      result = true;

      dmIndex = i;
    }
  }

  if (result !== true) {
    throw HTTPError(400, 'dmId does not exist!');
  }

  // Checking if start value is greater than number of messages.

  if (start > data.Dms[dmIndex].messages.length) {
    throw HTTPError(400, 'start value greater than number of messages!');
  }

  // Checking if authUserId of token is not a member of the DM.

  result = false;

  for (let i = 0; i < data.Dms[dmIndex].members.length; i++) {
    if (data.Dms[dmIndex].members[i] === data.Users[userIndex].uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Authorised user not apart of the DM!');
  }

  // Checking if starting value equals number of messages.

  if (start === data.Dms[dmIndex].messages.length) {
    return {

      messages: [],

      start: start,

      end: -1,

    };
  }

  // Retrieving messages for messages array and determining end value.

  const startingIndex = start;

  const messageNum = data.Dms[dmIndex].messages.length;

  const messagesRemaining = messageNum - start;

  const tempMessageEnd = start + 50;

  if (messagesRemaining >= 51) {
    end = tempMessageEnd;

    for (let i = startingIndex; i < tempMessageEnd; i++) {
      // check if the owner using it is in the reacts array and change it to true
      for (let j = 0; j < data.Dms[dmIndex].messages[i].reacts[0].uIds.length; j++) {
        if (data.Dms[dmIndex].messages[i].reacts[0].uIds[j] === uId) {
          data.Dms[dmIndex].messages[i].reacts[0].isThisUserReacted = true;
        }
      }
      messages.push(data.Dms[dmIndex].messages[i]);
    }
  } else {
    end = -1;

    for (let i = startingIndex; i < messageNum; i++) {
      // check if the owner using it is in the reacts array and change it to true
      for (let j = 0; j < data.Dms[dmIndex].messages[i].reacts[0].uIds.length; j++) {
        if (data.Dms[dmIndex].messages[i].reacts[0].uIds[j] === uId) {
          data.Dms[dmIndex].messages[i].reacts[0].isThisUserReacted = true;
        }
      }
      messages.push(data.Dms[dmIndex].messages[i]);
    }
  }

  return {

    messages: messages,

    start: start,

    end: end,

  };
}

/**

  * < The 'dmMessagesV1' function has the purpose returning upto 50 messages. >

  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } dmId - refers to the unique ID of a specific DM.
  * @param { integer } message - refers to the message being sent.
  * @param { integer } timeSent - refers to the time of message wanting to be sent.
  * ...

  * @returns { number } messageId - returns an array of objects containing details about the
  * messages such as messageId, uId, message, timeSent as well as the start and end.

*/

export function messageSendLaterDmV1(token: string, dmId: number, message: string, timeSent: number) {
  const currentData = getData();

  // check if token is valid
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  // check if message is between 1 and 1000
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'error');
  }

  let user;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        user = currentData.Users[i].uId;
      }
    }
  }

  // check if dmid is valid
  let validDmId = 0;
  let validMember = 0;
  for (let i = 0; i < currentData.Dms.length; i++) {
    if (currentData.Dms[i].dmId === dmId) {
      validDmId = 1;
      for (let j = 0; j < currentData.Dms[i].members.length; j++) {
        if (currentData.Dms[i].members[j] === user) {
          validMember = 1;
        }
      }
    }
  }

  if (validDmId === 0) {
    throw HTTPError(400, 'error');
  }
  if (validMember === 0) {
    throw HTTPError(403, 'error');
  }

  // check if time is in the past
  const now = Math.floor((new Date()).getTime() / 1000);

  if (timeSent < now) {
    throw HTTPError(400, 'error');
  }

  const time = timeSent - Math.floor((new Date()).getTime() / 1000);
  setTimeout(messageSendDmV2, time * 1000, token, dmId, message);
  return { messageId: timeSent };
}
