import { getData } from './dataStore';
import { setData } from './dataStore';
import HTTPError from 'http-errors';

// const currentData = getData();

// authRegisterV3('bob@gmail.com', 'djsjlda', 'dsljal', 'dslaka');
// authPasswordResetRequestV1('bob@gmail.com');
// authPasswordResetRequestV1('bob@gmail.com');
// authPasswordResetRequestV1('bob@gmail.com');

// console.log(currentData.Users[0].resetCodes);
// console.log(getData());

// authPasswordResetReset(currentData.Users[0].resetCodes[0], 'newPassword');
// authPasswordResetReset(currentData.Users[0].resetCodes[0], 'helldado');
// authPasswordResetReset(currentData.Users[0].resetCodes[0], 'bobdald');

// console.log(currentData.Users[0].resetCodes);
// console.log(getData());

//= =======================================================================================================================================

/**
  * < The 'finishStandup' function has the purpose of running code that occurs when standup is finished. >
  *
  * @param { number } channelIndex - refers to the index the channel is located at.
  * @param { number } timeFinish - refers to the time when the standup finishes.
  * @param { number } uId - refers to the userId of the token user making this request.
  * @param { number } userIndex - refers to the index the user making the request is located at.
  * ...
  *
  * @returns { } - returns nothing.
*/

export function finishStandup(channelIndex: number, timeFinish: number, uId: number, userIndex: number): void {
  let message = '';
  const newData = getData();
  const messages = newData.Channels[channelIndex].standUp.messages;
  if (messages.length > 0) {
    for (let i = 0; i < messages.length; i++) {
      if (i === (messages.length - 1)) {
        message = message + `${messages[i].handleStr}: ${messages[i].message}`;
      } else {
        message = message + `${messages[i].handleStr}: ${messages[i].message}\n`;
      }
    }
    const messageId = Math.floor((new Date()).getTime());
    const newMessage = {
      messageId: messageId,
      uId: uId,
      message: message,
      timeSent: timeFinish,
      reacts: [
        {
          reactId: 1,
          uIds: [],
          isThisUserReacted: false,
        }
      ],
      isPinned: false,
    };
    newData.Channels[channelIndex].messages.push(newMessage);

    // user stats.
    const userMessagesIndex = newData.Users[userIndex].messagesSent.length - 1;
    const userMessagesCurrently = newData.Users[userIndex].messagesSent[userMessagesIndex].numMessagesSent;
    const userMessages = userMessagesCurrently + 1;
    const timeStamp = timeFinish;
    const userData = {
      numMessagesSent: userMessages,
      timeStamp: timeStamp,
    };

    newData.Users[userIndex].messagesSent.push(userData);

    // Workspace
    const workMsgsExistIndex = newData.WorkSpace.messagesExist.length - 1;
    const workMsgsExistCurrently = newData.WorkSpace.messagesExist[workMsgsExistIndex].numMessagesExist;
    const workMsgsExist = workMsgsExistCurrently + 1;
    const workDataMsgs = {
      numMessagesExist: workMsgsExist,
      timeStamp: timeFinish,
    };
    newData.WorkSpace.messagesExist.push(workDataMsgs);

    // Clear up standup.
    newData.Channels[channelIndex].standUp.startingTime = 0;
    newData.Channels[channelIndex].standUp.endingTime = 0;
    newData.Channels[channelIndex].standUp.messages = [];
    setData(newData);
  }
}

/**
  * < The 'standupStartV1' function has the purpose of starting a standup. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { integer } length - refers to length of time standup lasts.
  * ...
  *
  * @returns { timeFinish } integer - returns an integer that shows when the standup will end.
*/
export function standupStartV1(token: string, channelId: number, length: number): object {
  const data = getData();
  // Used to store the index that the channel is located in.

  let channelIndex;

  // Used to store the index that the uId is located in.

  let userIndex;

  // Checking if token is valid.

  let resultToken = false;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;

    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        resultToken = true;

        userIndex = i;
      }
    }
  }

  if (resultToken !== true) {
    throw HTTPError(403, 'Token is invalid!');
  }

  const uId = data.Users[userIndex].uId;

  // Checking if channelId exists, and if so storing its locations index number.

  let result = false;

  for (let i = 0; i < data.Channels.length; i++) {
    if (data.Channels[i].channelId === channelId) {
      result = true;

      channelIndex = i;
    }
  }

  if (result !== true) {
    throw HTTPError(400, 'ChannelId does not exist!');
  }

  // if length negative
  if (length < 0) {
    throw HTTPError(400, 'Length can not be negative!');
  }

  // if standup active
  const ifActive = standupActiveV1(token, channelId);
  if (ifActive.isActive === true) {
    throw HTTPError(400, 'A standup is currently active!');
  }

  // Checking if authUserId that the token belongs to is not a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Authorised user is not a member of the channel!');
  }

  const timeStart = Math.floor((new Date()).getTime() / 1000);
  const timeFinish = timeStart + length;
  data.Channels[channelIndex].standUp.startingTime = timeStart;
  data.Channels[channelIndex].standUp.endingTime = timeFinish;
  setData(data);
  setTimeout(() => finishStandup(channelIndex, timeFinish, uId, userIndex), length * 1000);

  return {
    timeFinish: timeFinish,
  };
}

/**
  * < The 'standupActiveV1' function has the purpose of seeing if a standup is still active and when it will end. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * ...
  *
  * @returns { isActive, timeFinish } object - returns an object with key 'isActive', which is a boolean determining is standup is active,
  * and with the key timeFinish, which is an integer or null value which tells when the standup will end.
*/
export function standupActiveV1(token: string, channelId: number): object {
  const data = getData();
  // Used to store the index that the channel is located in.

  let channelIndex;

  // Used to store the index that the uId is located in.

  let userIndex;

  // Checking if token is valid.

  let resultToken = false;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;

    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        resultToken = true;

        userIndex = i;
      }
    }
  }

  if (resultToken !== true) {
    throw HTTPError(403, 'Token is invalid!');
  }

  const uId = data.Users[userIndex].uId;

  // Checking if channelId exists, and if so storing its locations index number.

  let result = false;

  for (let i = 0; i < data.Channels.length; i++) {
    if (data.Channels[i].channelId === channelId) {
      result = true;

      channelIndex = i;
    }
  }

  if (result !== true) {
    throw HTTPError(400, 'ChannelId does not exist!');
  }

  // Checking if authUserId that the token belongs to is not a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Authorised user is not a member of the channel!');
  }
  const currentTime = Math.floor((new Date()).getTime() / 1000);
  const endingTime = data.Channels[channelIndex].standUp.endingTime;
  const startingTime = data.Channels[channelIndex].standUp.startingTime;

  if (startingTime === 0 || endingTime === 0) {
    const newData = {
      isActive: false,
      timeFinish: null,
    };
    return newData;
  } else if (currentTime < endingTime && currentTime >= startingTime) {
    const newData = {
      isActive: true,
      timeFinish: endingTime,
    };
    return newData;
  } else {
    const newData = {
      isActive: false,
      timeFinish: null,
    };
    return newData;
  }
}

/**
  * < The 'standupSendV1' function has the purpose of sending messages to an active standup. >
  *
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { string } message - refers to a message user wants to send to an active standup.
  * ...
  *
  * @returns {  } - returns nothing.
*/
export function standupSendV1(token: string, channelId: number, message: string): object {
  const data = getData();
  // Used to store the index that the channel is located in.

  let channelIndex;

  // Used to store the index that the uId is located in.

  let userIndex;

  // Checking if token is valid.

  let resultToken = false;

  for (let i = 0; i < data.Users.length; i++) {
    const numberSessions = data.Users[i].token.length;

    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        resultToken = true;

        userIndex = i;
      }
    }
  }

  if (resultToken !== true) {
    throw HTTPError(403, 'Token is invalid!');
  }

  const uId = data.Users[userIndex].uId;

  // Checking if channelId exists, and if so storing its locations index number.

  let result = false;

  for (let i = 0; i < data.Channels.length; i++) {
    if (data.Channels[i].channelId === channelId) {
      result = true;

      channelIndex = i;
    }
  }

  if (result !== true) {
    throw HTTPError(400, 'ChannelId does not exist!');
  }

  // if length of message too long.
  if (message.length > 1000) {
    throw HTTPError(400, 'Message too long!');
  }

  // if standup not active
  const ifActive = standupActiveV1(token, channelId);
  if (ifActive.isActive === false) {
    throw HTTPError(400, 'A standup is currently not active!');
  }

  // Checking if authUserId that the token belongs to is not a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Authorised user is not a member of the channel!');
  }

  const currentTime = Math.floor((new Date()).getTime() / 1000);
  const endingTime = data.Channels[channelIndex].standUp.endingTime;
  const startingTime = data.Channels[channelIndex].standUp.startingTime;

  if ((startingTime !== 0 && endingTime !== 0) && (currentTime < endingTime && currentTime >= startingTime)) {
    const messageId = Math.floor((new Date()).getTime());
    const newMessage = {
      messageId: messageId,
      uId: uId,
      message: message,
      timeSent: currentTime,
      reacts: [
        {
          reactId: 1,
          uIds: [],
          isThisUserReacted: false,
        }
      ],
      isPinned: false,
      handleStr: data.Users[userIndex].handleStr,
    };
    data.Channels[channelIndex].standUp.messages.push(newMessage);
  }
  setData(data);
  return {};
}
