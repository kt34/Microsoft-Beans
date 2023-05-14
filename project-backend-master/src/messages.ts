import { getData } from './dataStore';
import { checkValidToken } from './dm';
import { setData } from './dataStore';
import { messageSendDmV2 } from './dm';
import HTTPError from 'http-errors';

function fetchChannel(channelId: number) {
  const currentData = getData();
  for (let i = 0; i < currentData.Channels.length; i++) {
    if (currentData.Channels[i].channelId === channelId) {
      return currentData.Channels[i].name;
    }
  }
}
function fetchDm(dmId: number) {
  const currentData = getData();
  for (let i = 0; i < currentData.Dms.length; i++) {
    if (currentData.Dms[i].dmId === dmId) {
      return currentData.Dms[i].name;
    }
  }
}
function fetchMessage(string: string) {
  if (string.length <= 20) {
    return string;
  } else {
    return string.substring(0, 20);
  }
}
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
  * < The 'messageRemoveV2' function has the purpose of removing a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { number } messagelId - refers to the unique ID of a specific message.
  * ...
  *
  * @returns {}
*/
export function messageRemoveV2(token: string, messageId: number) {
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'Token invalid!');
  }
  const currentData = getData();

  if (currentData.Channels.length === 0 && currentData.Dms.length === 0) {
    throw HTTPError(400, 'Message does not exist!');
  }

  let userId;
  let userIndex;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userIndex = i;
        userId = currentData.Users[i].uId;
      }
    }
  }
  let apart = 0;
  let index;
  let msgInd;
  let userMessage;
  let msgValid = 0;
  let validRemove = 0;
  let ownerValid;
  let globalValid = false;

  if (currentData.Dms.length !== 0) {
    // check if dms now
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
          if (userId === currentData.Dms[i].messages[j].uId) {
            userMessage = true;
          }
        }
      }
    }

    for (let i = 0; i < currentData.Dms[index].members.length; i++) {
      if (userId === currentData.Dms[index].members[i]) {
        validRemove = 1;
        apart = 1;
      }
    }

    if (userId === currentData.Dms[index].owner) {
      ownerValid = true;
      apart = 1;
    }

    if ((userMessage === true && validRemove === 1) || (ownerValid === true && msgValid === 1)) {
      currentData.Dms[index].messages.splice(msgInd, 1);
      // Gets the timestamp.
      const timeStamp = Math.floor((new Date()).getTime() / 1000);

      // workspace stats.
      const workMsgsExistIndex = currentData.WorkSpace.messagesExist.length - 1;
      const workMsgsExist = currentData.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
      const workMsgsExistCurrently = workMsgsExist - 1;
      const workDataMsgs = {
        numMessagesExist: workMsgsExistCurrently,
        timeStamp: timeStamp,
      };
      currentData.WorkSpace.messagesExist.push(workDataMsgs);

      setData(currentData);
      return {};
    }
  }

  if (currentData.Channels.length !== 0) {
    for (let i = 0; i < currentData.Channels.length; i++) {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        if (messageId === currentData.Channels[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
          if (userId === currentData.Channels[i].messages[j].uId) {
            userMessage = true;
          }
        }
      }
    }

    for (let i = 0; i < currentData.Channels[index].members.length; i++) {
      if (userId === currentData.Channels[index].members[i].uId) {
        validRemove = 1;
        apart = 1;
      }
    }

    for (let i = 0; i < currentData.Channels[index].owners.length; i++) {
      if (userId === currentData.Channels[index].owners[i].uId) {
        ownerValid = true;
        apart = 1;
      }
    }

    if (currentData.Users[userIndex].permissionId === 1) {
      globalValid = true;
    }

    if ((userMessage === true && validRemove === 1) || (ownerValid === true && msgValid === 1) || (globalValid === true && msgValid === 1)) {
      currentData.Channels[index].messages.splice(msgInd, 1);
      // Gets the timestamp.
      const timeStamp = Math.floor((new Date()).getTime() / 1000);

      // workspace stats.
      const workMsgsExistIndex = currentData.WorkSpace.messagesExist.length - 1;
      const workMsgsExist = currentData.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
      const workMsgsExistCurrently = workMsgsExist - 1;
      const workDataMsgs = {
        numMessagesExist: workMsgsExistCurrently,
        timeStamp: timeStamp,
      };
      currentData.WorkSpace.messagesExist.push(workDataMsgs);

      setData(currentData);
      return {};
    }
  }

  if (msgValid === 0 || apart !== 1) {
    throw HTTPError(400, 'Message does not exist!');
  } else {
    throw HTTPError(403, 'Authorised user can not remove this message!');
  }
}
/**
  * < The 'messageEditV2' function has the purpose of editing a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { number } messagelId - refers to the unique ID of a specific message.
  * @param { string } message - the message it want to change.
  * ...
  *
  * @returns {}
*/
export function messageEditV2(token: string, messageId: number, message: string): object {
  const validToken = checkValidToken(token);
  let userIndex;
  let userHandleSent;
  if (!validToken) {
    throw HTTPError(403, 'Token invalid!');
  }

  if (message.length > 1000) {
    throw HTTPError(400, 'Message too long!');
  }

  const currentData = getData();

  if (currentData.Channels.length === 0 && currentData.Dms.length === 0) {
    throw HTTPError(400, 'Message does not exist!');
  }

  let userId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userId = currentData.Users[i].uId;
        userIndex = i;
        userHandleSent = currentData.Users[i].handleStr;
      }
    }
  }

  let index;
  let msgInd;
  let userMessage;
  let msgValid = 0;
  let validRemove = 0;
  let ownerValid;
  let globalValid = false;
  let channelId;
  let dmId;

  if (currentData.Dms.length !== 0) {
    // check if dms now
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          index = i;
          msgInd = j;
          dmId = currentData.Dms[i].dmId;
          if (userId === currentData.Dms[i].messages[j].uId) {
            userMessage = true;
          }
        }
      }
    }

    for (let i = 0; i < currentData.Dms[index].members.length; i++) {
      if (userId === currentData.Dms[index].members[i]) {
        validRemove = 1;
        msgValid = 1;
      }
    }

    if (userId === currentData.Dms[index].owner) {
      ownerValid = true;
      msgValid = 1;
    }

    if ((userMessage === true && validRemove === 1) || (ownerValid === true && msgValid === 1)) {
      if (message.length === 0) {
        currentData.Dms[index].messages.splice(msgInd, 1);
        // Gets the timestamp.
        const timeStamp = Math.floor((new Date()).getTime() / 1000);

        // workspace stats.
        const workMsgsExistIndex = currentData.WorkSpace.messagesExist.length - 1;
        const workMsgsExist = currentData.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
        const workMsgsExistCurrently = workMsgsExist - 1;
        const workDataMsgs = {
          numMessagesExist: workMsgsExistCurrently,
          timeStamp: timeStamp,
        };
        currentData.WorkSpace.messagesExist.push(workDataMsgs);
      } else {
        const currentMessage = currentData.Dms[index].messages[msgInd].message;
        // notifications.
        const memberUids = [];
        for (let i = 0; i < currentData.Dms[index].members.length; i++) {
          memberUids.push(currentData.Dms[index].members[i]);
        }
        const memberNameWithAts = [];
        for (let i = 0; i < currentData.Users.length; i++) {
          for (let j = 0; j < memberUids.length; j++) {
            if (currentData.Users[i].uId === memberUids[j]) {
              memberNameWithAts.push('@' + currentData.Users[i].handleStr);
            }
          }
        }

        // final@ that are included in the message
        const finalAtsOriginal = [];
        const finalAtsNew = [];
        const finalAts = [];
        let isTag = false;
        let tag = '';
        for (let i = 0; i < memberNameWithAts.length; i++) {
          if (currentMessage.includes(memberNameWithAts[i])) {
            const stringIndex = currentMessage.search(memberNameWithAts[i]);
            const handleLength = memberNameWithAts[i].length;
            isTag = true;
            let j = stringIndex + (handleLength);
            tag = memberNameWithAts[i];
            while (isTag === true && j < currentMessage.length) {
              if (isAlphaNumeric(currentMessage[j])) {
                tag = tag + currentMessage[j];
              } else {
                isTag = false;
              }
              j++;
            }
            finalAtsOriginal.push(tag);
          }
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
            finalAtsNew.push(tag);
          }
        }

        for (let i = 0; i < finalAtsNew.length; i++) {
          if (!(finalAtsOriginal.includes(finalAtsNew[i]))) {
            finalAts.push(finalAtsNew[i]);
          }
        }
        for (let i = 0; i < currentData.Users.length; i++) {
          for (let j = 0; j < finalAts.length; j++) {
            const newHandleStr = '@' + currentData.Users[i].handleStr;
            if (finalAts[j] === newHandleStr) {
              const notificationData = {
                channelId: -1,
                dmId: dmId,
                messageSenderHandle: userHandleSent,
                type: 'tagDm',
                message: message
              };
              currentData.Users[i].notifications.push(notificationData);
            }
          }
        }

        currentData.Dms[index].messages[msgInd].message = message;
      }
      setData(currentData);
      return {};
    }

    if (msgValid === 0) {
      throw HTTPError(400, 'Message does not exist!');
    } else {
      throw HTTPError(403, 'Authorised user can not remove this message!');
    }
  }

  if (currentData.Channels.length !== 0) {
    for (let i = 0; i < currentData.Channels.length; i++) {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        if (messageId === currentData.Channels[i].messages[j].messageId) {
          index = i;
          msgInd = j;
          channelId = currentData.Channels[i].channelId;
          if (userId === currentData.Channels[i].messages[j].uId) {
            userMessage = true;
          }
        }
      }
    }

    for (let i = 0; i < currentData.Channels[index].members.length; i++) {
      if (userId === currentData.Channels[index].members[i].uId) {
        validRemove = 1;
        msgValid = 1;
      }
    }

    for (let i = 0; i < currentData.Channels[index].owners.length; i++) {
      if (userId === currentData.Channels[index].owners[i].uId) {
        ownerValid = true;
        msgValid = 1;
      }
    }

    if (currentData.Users[userIndex].permissionId === 1) {
      globalValid = true;
    }

    if ((userMessage === true && validRemove === 1) || (ownerValid === true && msgValid === 1) || (globalValid === true && msgValid === 1)) {
      if (message.length === 0) {
        currentData.Channels[index].messages.splice(msgInd, 1);
        // Gets the timestamp.
        const timeStamp = Math.floor((new Date()).getTime() / 1000);

        // workspace stats.
        const workMsgsExistIndex = currentData.WorkSpace.messagesExist.length - 1;
        const workMsgsExist = currentData.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
        const workMsgsExistCurrently = workMsgsExist - 1;
        const workDataMsgs = {
          numMessagesExist: workMsgsExistCurrently,
          timeStamp: timeStamp,
        };
        currentData.WorkSpace.messagesExist.push(workDataMsgs);
      } else {
        const currentMessage = currentData.Channels[index].messages[msgInd].message;
        // notifications.
        const memberNameWithAts = [];
        for (let i = 0; i < currentData.Channels[index].members.length; i++) {
          memberNameWithAts.push('@' + currentData.Channels[index].members[i].handleStr);
        }
        // final@ that are included in the message
        const finalAtsOriginal = [];
        const finalAtsNew = [];
        const finalAts = [];
        let isTag = false;
        let tag = '';
        for (let i = 0; i < memberNameWithAts.length; i++) {
          if (currentMessage.includes(memberNameWithAts[i])) {
            const stringIndex = currentMessage.search(memberNameWithAts[i]);
            const handleLength = memberNameWithAts[i].length;
            isTag = true;
            let j = stringIndex + (handleLength);
            tag = memberNameWithAts[i];
            while (isTag === true && j < currentMessage.length) {
              if (isAlphaNumeric(currentMessage[j])) {
                tag = tag + currentMessage[j];
              } else {
                isTag = false;
              }
              j++;
            }
            finalAtsOriginal.push(tag);
          }
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
            finalAtsNew.push(tag);
          }
        }
        for (let i = 0; i < finalAtsNew.length; i++) {
          if (!(finalAtsOriginal.includes(finalAtsNew[i]))) {
            finalAts.push(finalAtsNew[i]);
          }
        }
        for (let i = 0; i < currentData.Users.length; i++) {
          for (let j = 0; j < finalAts.length; j++) {
            const newHandleStr = '@' + currentData.Users[i].handleStr;
            if (finalAts[j] === newHandleStr) {
              const notificationData = {
                channelId: channelId,
                dmId: -1,
                messageSenderHandle: userHandleSent,
                type: 'tagChannel',
                message: message
              };
              currentData.Users[i].notifications.push(notificationData);
            }
          }
        }

        currentData.Channels[index].messages[msgInd].message = message;
      }
      setData(currentData);
      return {};
    }
  }

  if (msgValid !== 0) {
    throw HTTPError(403, 'Authorised user can not remove this message!');
  }
}

/**
  * < The 'messageReactV1' function has the purpose of reacting a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { number } messagelId - refers to the unique ID of a specific message.
  * @param { number } reactId - the message it want to change.
  * ...
  *
  * @returns {}
*/
export function messageReactV1 (token: string, messageId: number, reactId: number) {
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  if (reactId !== 1) {
    throw HTTPError(400, 'error');
  }

  const currentData = getData();

  // get the valid token uid
  let uId;
  let userHandle;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        uId = currentData.Users[i].uId;
        userHandle = currentData.Users[i].handleStr;
      }
    }
  }

  let validReactId = true;

  let validChannelMessage = false;
  let index1 = -1;
  let index2 = -1;
  let channelId = -1;
  let dmId = -1;
  // check if the message is a valid message within a channel or dm
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
      if (messageId === currentData.Channels[i].messages[j].messageId) {
        channelId = currentData.Channels[i].channelId;
        validChannelMessage = true;
        index1 = i;
        index2 = j;
        for (let k = 0; k < currentData.Channels[i].messages[j].reacts[0].uIds.length; k++) {
          if (currentData.Channels[i].messages[j].reacts[0].uIds[k] === uId) {
            validReactId = false;
          }
        }
      }
    }
  }

  let validDmMessage = false;
  // check in dm if it is not in channels
  if (!validChannelMessage) {
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          dmId = currentData.Dms[i].dmId;
          validDmMessage = true;
          index1 = i;
          index2 = j;
          for (let k = 0; k < currentData.Dms[i].messages[j].reacts[0].uIds.length; k++) {
            if (currentData.Dms[i].messages[j].reacts[0].uIds[k] === uId) {
              validReactId = false;
            }
          }
        }
      }
    }
  }

  // not a valid message id
  if (!validDmMessage && !validChannelMessage) {
    throw HTTPError(400, 'error');
  }

  // the message has already been reacted to
  if (!validReactId) {
    throw HTTPError(400, 'error');
  }

  // now add the react
  if (!validChannelMessage) {
    currentData.Dms[index1].messages[index2].reacts[0].uIds.push(uId);
  } else if (!validDmMessage) {
    currentData.Channels[index1].messages[index2].reacts[0].uIds.push(uId);
  }

  // update the notifications array for the user
  // find the person who the message belongs to
  let userMessageBelongToUid;
  if (!validChannelMessage) {
    userMessageBelongToUid = currentData.Dms[index1].messages[index2].uId;
  } else if (!validDmMessage) {
    userMessageBelongToUid = currentData.Channels[index1].messages[index2].uId;
  }

  // now for that user add the notification
  for (let i = 0; i < currentData.Users.length; i++) {
    if (userMessageBelongToUid === currentData.Users[i].uId) {
      const notificationUserData = {
        channelId: channelId,
        dmId: dmId,
        messageSenderHandle: userHandle,
        type: 'react',
        message: ''
      };
      currentData.Users[i].notifications.push(notificationUserData);
    }
  }

  return {};
}
/**
  * < The 'messageReactV1' function has the purpose of unreacting a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { number } messagelId - refers to the unique ID of a specific message.
  * @param { number } reactId - the message it want to change.
  * ...
  *
  * @returns {}
*/
export function messageUnreactV1 (token: string, messageId: number, reactId: number) {
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  if (reactId !== 1) {
    throw HTTPError(400, 'error');
  }

  const currentData = getData();

  // get the valid token uid
  let uId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        uId = currentData.Users[i].uId;
      }
    }
  }

  let validReactId = false;

  let validChannelMessage = false;
  let index1 = -1;
  let index2 = -1;
  let index3 = -1;
  // check if the message is a valid message within a channel or dm
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
      if (messageId === currentData.Channels[i].messages[j].messageId) {
        validChannelMessage = true;
        index1 = i;
        index2 = j;
        for (let k = 0; k < currentData.Channels[i].messages[j].reacts[0].uIds.length; k++) {
          if (currentData.Channels[i].messages[j].reacts[0].uIds[k] === uId) {
            index3 = k;
            validReactId = true;
          }
        }
      }
    }
  }

  let validDmMessage = false;
  // check in dm if it is not in channels
  if (!validChannelMessage) {
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          validDmMessage = true;
          index1 = i;
          index2 = j;
          for (let k = 0; k < currentData.Dms[i].messages[j].reacts[0].uIds.length; k++) {
            if (currentData.Dms[i].messages[j].reacts[0].uIds[k] === uId) {
              index3 = k;
              validReactId = true;
            }
          }
        }
      }
    }
  }

  // not a vaalid message id
  if (!validDmMessage && !validChannelMessage) {
    throw HTTPError(400, 'error');
  }

  // the message has already been reacted to
  if (!validReactId) {
    throw HTTPError(400, 'error');
  }

  // now add the react
  if (!validChannelMessage) {
    currentData.Dms[index1].messages[index2].reacts[0].uIds.splice(index3, 1);
  } else if (!validDmMessage) {
    currentData.Channels[index1].messages[index2].reacts[0].uIds.splice(index3, 1);
  }

  return {};
}

/**
  * < The 'messageShareV1' function has the purpose of sharing a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { number } ogMessagelId - number of original messageID
  * @param { string } message - the message it want to share.
  * @param { number } channelId - number of channelId
  * @param { number } dmId - number of dmId
  * ...
  *
  * @returns {}
*/
export function messageShareV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  // if the message is over 1000
  if (message.length > 1000) {
    throw HTTPError(400, 'error 1');
  }

  const validToken = checkValidToken(token);
  // if the token is invalid
  if (!validToken) {
    throw HTTPError(403, 'error 2');
  }

  // if both channelid and dmid is invalid
  if (channelId === -1 && dmId === -1) {
    throw HTTPError(400, 'error 3');
  }

  // if none of them are valid
  if (channelId !== -1 && dmId !== -1) {
    throw HTTPError(400, 'error 4');
  }

  const currentData = getData();

  // get the valid token uid
  let uId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        uId = currentData.Users[i].uId;
      }
    }
  }

  // now both ids cannot be -1
  // check if both channelId and dmId are valid

  // if the dmId = -1 then channelId is valid check if valid
  let validChannel = 0;
  let channelIndex;
  if (dmId === -1) {
    for (let i = 0; i < currentData.Channels.length; i++) {
      if (currentData.Channels[i].channelId === channelId) {
        validChannel = 1;
        channelIndex = i;
      }
    }
  }

  // if the channelId = -1 then the dmId is valid check
  let validDm = 0;
  let dmIndex;
  if (channelId === -1) {
    for (let i = 0; i < currentData.Dms.length; i++) {
      if (currentData.Dms[i].dmId === dmId) {
        validDm = 1;
        dmIndex = i;
      }
    }
  }

  // now either the channel id is valid or the dm id is valid
  // now check if the user is part of either the channel or dm
  let userIsInValidChannelOrDm = 0;

  if (validDm === 1) {
    for (let i = 0; i < currentData.Dms[dmIndex].members.length; i++) {
      if (currentData.Dms[dmIndex].members[i] === uId) {
        userIsInValidChannelOrDm = 1;
      }
    }
  } else if (validChannel === 1) {
    for (let i = 0; i < currentData.Channels[channelIndex].members.length; i++) {
      if (currentData.Channels[channelIndex].members[i].uId === uId) {
        userIsInValidChannelOrDm = 1;
      }
    }
  }

  if (userIsInValidChannelOrDm === 0) {
    throw HTTPError(403, 'error 7');
  }

  // now check if the messageId does not refer to a valid message within a channelDM that the authrosied user has joiend
  let validMessageId = 0;
  let oldMessage;
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
      if (currentData.Channels[i].messages[j].messageId === ogMessageId) {
        oldMessage = currentData.Channels[i].messages[j].message;
        validMessageId = 1;
      }
    }
  }

  for (let i = 0; i < currentData.Dms.length; i++) {
    for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
      if (currentData.Dms[i].messages[j].messageId === ogMessageId) {
        oldMessage = currentData.Dms[i].messages[j].message;
        validMessageId = 1;
      }
    }
  }

  // now if valid message id = 0 then the message id is invalid
  if (validMessageId === 0) {
    throw HTTPError(400, 'error 8');
  }

  // now that everything is checked send the message
  const temp = oldMessage.concat(' ');
  const finalMessage = temp.concat(message);
  const messageId = Math.floor((new Date()).getTime());

  if (dmId === -1) {
    messageSendV2(token, channelId, finalMessage);
  } else if (channelId === -1) {
    messageSendDmV2(token, dmId, finalMessage);
  }

  return {
    sharedMessageId: messageId
  };
}
// const currentData = getData();
// const user1 = authRegisterV3('bob@gmail.com', 'dshkda', 'dsjada', 'dasljdlasjl');
// console.log(notificationsV1(user1.token));
// console.log(currentData.Users[0]);
/**
  * < The 'notificationsV1' function has the purpose of returning notifications a message of the user from a channel/Dm. >
  *   @param { string } token - refers to the sessionId of the individual who called the function.

  * ...
  *
  * @returns {object} notifications - returns an object containging the notification of the user and the name of the dm/channel
*/
export function notificationsV1(token: string) {
  const currentData = getData();

  // check if token is valid
  let user;
  let validToken = 0;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        user = currentData.Users[i];
        validToken = 1;
      }
    }
  }
  if (validToken === 0) {
    throw HTTPError(403, 'error');
  }

  if (user.notifications.length === 0) {
    return { notifications: [] };
  }

  // clone the array so no changes are done in the main dataStore
  const tempArray = structuredClone(user.notifications);
  // reverses the array
  const reversedArray = tempArray.reverse();

  // keeps track of how many notifications there are
  const notificationData = [];
  let count = 0;
  let channelName, channelIdData, dmIdData, messagesData, trimMessage;
  let tempNotificationData = {};

  for (let i = 0; i < reversedArray.length; i++) {
    if (reversedArray[i].type === 'react') {
      if (reversedArray[i].channelId !== -1) {
        channelName = fetchChannel(reversedArray[i].channelId);
        channelIdData = reversedArray[i].channelId;
        dmIdData = reversedArray[i].dmId;
        messagesData = reversedArray[i].messageSenderHandle + ' reacted to your message in ' + channelName;
        tempNotificationData = {
          channelId: channelIdData,
          dmId: dmIdData,
          notificationMessage: messagesData,
        };
        notificationData.push(tempNotificationData);
        count++;
      } else {
        // look for the name of the dm
        channelName = fetchDm(reversedArray[i].dmId);
        channelIdData = reversedArray[i].channelId;
        dmIdData = reversedArray[i].dmId;
        messagesData = reversedArray[i].messageSenderHandle + ' reacted to your message in ' + channelName;
        tempNotificationData = {
          channelId: channelIdData,
          dmId: dmIdData,
          notificationMessage: messagesData,
        };
        notificationData.push(tempNotificationData);
        count++;
      }
    } else if (reversedArray[i].type === 'tagChannel') {
      channelName = fetchChannel(reversedArray[i].channelId);
      channelIdData = reversedArray[i].channelId;
      dmIdData = reversedArray[i].dmId;
      trimMessage = fetchMessage(reversedArray[i].message);
      messagesData = reversedArray[i].messageSenderHandle + ' tagged you in ' + channelName + ': {' + trimMessage + '}';

      tempNotificationData = {
        channelId: channelIdData,
        dmId: dmIdData,
        notificationMessage: messagesData,
      };
      notificationData.push(tempNotificationData);
      count++;
    } else if (reversedArray[i].type === 'tagDm') {
      channelName = fetchDm(reversedArray[i].dmId);
      channelIdData = reversedArray[i].channelId;
      dmIdData = reversedArray[i].dmId;
      trimMessage = fetchMessage(reversedArray[i].message);
      messagesData = reversedArray[i].messageSenderHandle + ' tagged you in ' + channelName + ': {' + trimMessage + '}';

      tempNotificationData = {
        channelId: channelIdData,
        dmId: dmIdData,
        notificationMessage: messagesData,
      };
      notificationData.push(tempNotificationData);
      count++;
    } else if (reversedArray[i].type === 'addChannel') {
      channelName = fetchChannel(reversedArray[i].channelId);
      channelIdData = reversedArray[i].channelId;
      dmIdData = reversedArray[i].dmId;
      messagesData = reversedArray[i].messageSenderHandle + ' added you to ' + channelName;

      tempNotificationData = {
        channelId: channelIdData,
        dmId: dmIdData,
        notificationMessage: messagesData,
      };
      notificationData.push(tempNotificationData);
      count++;
    } else if (reversedArray[i].type === 'addDm') {
      channelName = fetchDm(reversedArray[i].dmId);
      channelIdData = reversedArray[i].channelId;
      dmIdData = reversedArray[i].dmId;
      messagesData = reversedArray[i].messageSenderHandle + ' added you to ' + channelName;

      tempNotificationData = {
        channelId: channelIdData,
        dmId: dmIdData,
        notificationMessage: messagesData,
      };
      notificationData.push(tempNotificationData);
      count++;
    }

    if (count === 20) {
      break;
    }
  }
  return { notifications: notificationData };
}

/**
  * < The 'searchV1' function has the purpose of searching a specific string of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { string } message - refers to the message being sent.
  * ...
  *
  * @returns { object} messages - Array of objects, where each object contains types { messageId, uId, message, timeSent }
*/
export function searchV1(token: string, queryStr: string) {
  const currentData = getData();

  // check if querystr is between 1 and 1000
  if (queryStr.length > 1000 || queryStr.length < 1) {
    throw HTTPError(400, 'error');
  }

  // checks if token is valid
  let user;
  let tokenIndex = 0;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        user = currentData.Users[i].uId;
        tokenIndex = 1;
      }
    }
  }
  if (tokenIndex === 0) {
    throw HTTPError(403, 'error');
  }

  // look for the messages in channel

  const messages = [];
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      if (currentData.Channels[i].members[j].uId === user) {
        for (let k = 0; k < currentData.Channels[i].messages.length; k++) {
          if ((currentData.Channels[i].messages[k].message.toLowerCase().includes(queryStr.toLowerCase())) === true) {
            messages.push(currentData.Channels[i].messages[k]);
          }
        }
      }
    }
  }

  // look for messages in dm
  for (let i = 0; i < currentData.Dms.length; i++) {
    for (let j = 0; j < currentData.Dms[i].members.length; j++) {
      if (currentData.Dms[i].members[j] === user) {
        for (let k = 0; k < currentData.Dms[i].messages.length; k++) {
          if ((currentData.Dms[i].messages[k].message.toLowerCase().includes(queryStr.toLowerCase())) === true) {
            messages.push(currentData.Dms[i].messages[k]);
          }
        }
      }
    }
  }

  if (messages.length === 0) {
    return {};
  }
  return { messages: messages };
}

/**
  * < The 'messagePinV1' function has the purpose of pinning a message. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } messagelId - refers to the unique ID of a specific message.
  * ...
  *
  * @returns {}
*/
export function messagePinV1(token: string, messageId: number): object {
  const validToken = checkValidToken(token);

  // Used to find index of user.
  let userIndex;

  if (!validToken) {
    throw HTTPError(403, 'Token invalid!');
  }
  const currentData = getData();

  let apart = 0;
  let userId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userId = currentData.Users[i].uId;
        userIndex = i;
      }
    }
  }

  let index;
  let msgInd;
  let msgValid = 0;
  let validPin = 0;
  let ownerValid;

  if (currentData.Dms.length !== 0) {
    // check if dms now
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
        }
      }
    }
    if (currentData.Dms[index].messages[msgInd].isPinned === true) {
      throw HTTPError(400, 'Already pinned!');
    }

    if (userId === currentData.Dms[index].owner) {
      ownerValid = true;
      validPin = 1;
      apart = 1;
    }

    if (ownerValid === true && msgValid === 1 && validPin === 1) {
      currentData.Dms[index].messages[msgInd].isPinned = true;
      setData(currentData);
      return {};
    }
  }

  if (currentData.Channels.length !== 0) {
    for (let i = 0; i < currentData.Channels.length; i++) {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        if (messageId === currentData.Channels[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
        }
      }
    }
    if (currentData.Channels[index].messages[msgInd].isPinned === true) {
      throw HTTPError(400, 'Already pinned!');
    }

    for (let i = 0; i < currentData.Channels[index].owners.length; i++) {
      if (userId === currentData.Channels[index].owners[i].uId) {
        ownerValid = true;
        validPin = 1;
        apart = 1;
      }
    }

    for (let i = 0; i < currentData.Channels[index].members.length; i++) {
      if (userId === currentData.Channels[index].members[i].uId) {
        apart = 1;
      }
    }

    if (ownerValid === true && msgValid === 1 && validPin === 1) {
      currentData.Channels[index].messages[msgInd].isPinned = true;
      setData(currentData);
      return {};
    }
    if (currentData.Users[userIndex].permissionId === 1 && msgValid === 1) {
      currentData.Channels[index].messages[msgInd].isPinned = true;
      setData(currentData);
      return {};
    }
  }

  if (msgValid === 0 || apart === 0) {
    throw HTTPError(400, 'Message does not exist!');
  } else {
    throw HTTPError(403, 'Authorised user can not pin this message!');
  }
}

/**
  * < The 'messageUnpinV1' function has the purpose of unpinning a message. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } messagelId - refers to the unique ID of a specific message.
  * ...
  *
  * @returns {}
*/
export function messageUnpinV1(token: string, messageId: number): object {
  const validToken = checkValidToken(token);

  // index of where user is located.
  let userIndex;

  if (!validToken) {
    throw HTTPError(403, 'Token invalid!');
  }
  const currentData = getData();

  let userId;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userId = currentData.Users[i].uId;
        userIndex = i;
      }
    }
  }

  let index;
  let msgInd;
  let msgValid = 0;
  let validPin = 0;
  let ownerValid;
  let apart = 0;

  if (currentData.Dms.length !== 0) {
    // check if dms now
    for (let i = 0; i < currentData.Dms.length; i++) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (messageId === currentData.Dms[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
        }
      }
    }
    if (currentData.Dms[index].messages[msgInd].isPinned === false) {
      throw HTTPError(400, 'Message not already pinned!');
    }

    if (userId === currentData.Dms[index].owner) {
      ownerValid = true;
      validPin = 1;
      apart = 1;
    }

    for (let i = 0; i < currentData.Dms[index].members.length; i++) {
      if (userId === currentData.Dms[index].members[i]) {
        apart = 1;
      }
    }

    if (ownerValid === true && msgValid === 1 && validPin === 1) {
      currentData.Dms[index].messages[msgInd].isPinned = false;
      setData(currentData);
      return {};
    }
  }

  if (currentData.Channels.length !== 0) {
    for (let i = 0; i < currentData.Channels.length; i++) {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        if (messageId === currentData.Channels[i].messages[j].messageId) {
          msgValid = 1;
          index = i;
          msgInd = j;
        }
      }
    }
    if (currentData.Channels[index].messages[msgInd].isPinned === false) {
      throw HTTPError(400, 'Message not already pinned!');
    }

    for (let i = 0; i < currentData.Channels[index].owners.length; i++) {
      if (userId === currentData.Channels[index].owners[i].uId) {
        ownerValid = true;
        validPin = 1;
        apart = 1;
      }
    }

    for (let i = 0; i < currentData.Channels[index].members.length; i++) {
      if (userId === currentData.Channels[index].members[i].uId) {
        apart = 1;
      }
    }

    if (ownerValid === true && msgValid === 1 && validPin === 1) {
      currentData.Channels[index].messages[msgInd].isPinned = false;
      setData(currentData);
      return {};
    }
    if (currentData.Users[userIndex].permissionId === 1 && msgValid === 1) {
      currentData.Channels[index].messages[msgInd].isPinned = false;
      setData(currentData);
      return {};
    }
  }

  if (msgValid === 0 || apart === 0) {
    throw HTTPError(400, 'Message does not exist!');
  } else {
    throw HTTPError(403, 'Authorised user can not pin this message!');
  }
}
/**
  * < The 'messageSendV2' function has the purpose of sending a message to a channel. >
  *
  * @param { string } token - refers to the sessionId of the individual
  * who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { string } message - refers to the message being sent.
  * ...
  *
  * @returns { object } - returns an object that contains details of what the messageId is.
*/
export function messageSendV2(token: string, channelId: number, message: string) {
  // dataStore being used to store and retrieve data.
  const data = getData();

  // Used to store the index that the channel is located in.
  let channelIndex;
  // Used to store the index that the uId is located in for the token.
  let userIndex;
  let userHandleSent;
  // Checking if token is valid.
  let result = false;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;
    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        result = true;
        userIndex = i;
        userHandleSent = data.Users[i].handleStr;
      }
    }
  }
  if (result !== true) {
    throw HTTPError(403, 'Token invalid!');
  }

  // Checking if channelId exists.
  result = false;

  for (let i = 0; i < data.Channels.length; i++) {
    if (data.Channels[i].channelId === channelId) {
      result = true;
      channelIndex = i;
    }
  }
  if (result !== true) {
    throw HTTPError(400, 'channelId does not exist!');
  }

  // Checking if authUserId of token is not a member of the channel.
  result = false;
  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === data.Users[userIndex].uId) {
      result = true;
    }
  }
  if (result !== true) {
    throw HTTPError(403, 'Authorised user is not a member of the channel!');
  }

  // checking if message is too long or short.
  if (message.length > 1000 || message.length < 1) {
    throw HTTPError(400, 'Message input has an incorrect length!');
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
  data.Channels[channelIndex].messages.push(newData);

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
  const memberNameWithAts = [];
  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    memberNameWithAts.push('@' + data.Channels[channelIndex].members[i].handleStr);
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
          channelId: channelId,
          dmId: -1,
          messageSenderHandle: userHandleSent,
          type: 'tagChannel',
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
  * < The 'messageEditV1' function has the purpose of editing a message of the user from a channel/Dm. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { string } message - refers to the message being sent.
  * @param { integer } timeSent - refers to the time the message is being sent
  * ...
  *
  * @returns {}
*/

export function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
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

  // checks if channelId is valid
  let channelIndex = 0;
  let channel;
  for (let i = 0; i < currentData.Channels.length; i++) {
    if (currentData.Channels[i].channelId === channelId) {
      channelIndex = 1;

      channel = currentData.Channels[i];
    }
  }

  if (channelIndex === 0) {
    throw HTTPError(400, 'error');
  }

  // check if time is in the past
  const now = Math.floor((new Date()).getTime() / 1000);

  if (timeSent < now) {
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

  // check if channelId is valid if user is a member of the channel
  for (let i = 0; i < channel.members.length; i++) {
    if (channel.members[i].uId === user) {
      channelIndex = 0;
    }
  }
  if (channelIndex === 1) {
    throw HTTPError(403, 'error');
  }
  const time = timeSent - Math.floor((new Date()).getTime() / 1000);
  setTimeout(messageSendV2, time * 1000, token, channelId, message);
  return { messageId: timeSent };
}
