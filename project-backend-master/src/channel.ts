import { getData } from './dataStore';
import { setData } from './dataStore';
import HTTPError from 'http-errors';
import { checkValidToken } from './dm';
/**

  * < The 'channelInviteV3' function has the purpose of inviting >
  * < a valid user via their uId. Once invited, the user is then >
  * < added to the channel immediately.                          >
  * @param { string } token - refers to the sessionId of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { integer } uId - refers to the userId of the individual who has been called.
  * ...
  * @returns { } - returns nothing.
*/
export function channelInviteV3(token, channelId, uId) {
  const data = getData();

  // Used to store the index that the channel is located in.

  let channelIndex;

  // Used to store the index that the uId is located in.

  let userIndex;

  let authUserIndex;

  // Checking if token and uId is valid.

  let resultToken = false;

  let resultuId = false;

  for (let i = 0; i < data.Users.length; i++) {
    if (data.Users[i].uId === uId) {
      resultuId = true;

      userIndex = i;
    }

    const numberSessions = data.Users[i].token.length;

    for (let j = 0; j < numberSessions; j++) {
      if (data.Users[i].token[j].sessionId === token) {
        resultToken = true;

        authUserIndex = i;
      }
    }
  }

  if (resultuId !== true) {
    throw HTTPError(400, 'uId does not exist!');
  }

  if (resultToken !== true) {
    throw HTTPError(403, 'Token is invalid!');
  }

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

  // Checking if uId is already a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === uId) {
      result = true;
    }
  }

  if (result === true) {
    throw HTTPError(400, 'User already a member of channel!');
  }

  // Checking if authUserId that the token belongs to is not a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === data.Users[authUserIndex].uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'Authorised user is not a member of the channel!');
  }

  const newData = {

    uId: data.Users[userIndex].uId,

    email: data.Users[userIndex].email,

    nameFirst: data.Users[userIndex].nameFirst,

    nameLast: data.Users[userIndex].nameLast,

    handleStr: data.Users[userIndex].handleStr,

  };

  data.Channels[channelIndex].members.push(newData);

  // user stats.

  const userChannelJoin = data.Users[userIndex].channelsJoined.length;

  const timeStamp = Math.floor((new Date()).getTime() / 1000);

  const userData = {

    numChannelsJoined: userChannelJoin,

    timeStamp: timeStamp,

  };

  data.Users[userIndex].channelsJoined.push(userData);

  // notifications.

  const notification = {

    channelId: channelId,

    dmId: -1,

    messageSenderHandle: data.Users[authUserIndex].handleStr,

    type: 'addChannel',

    message: '',

  };

  data.Users[userIndex].notifications.push(notification);

  setData(data);

  return {};
}

/**

  * < The 'channelJoinV3' function has the purpose of adding >
  * < an authorised user to a designated channel depending upon >
  * < the channelId passed in.                               >
  * @param { string } token - refers to the unique token of the individual who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * ...
  * @returns { Object } - returns an empty object indicating success of the function or else it returns an error.
*/
export function channelJoinV3(token: string, channelId: number): object {
  const currentData = getData();

  // error checking to see if the token is valid.

  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // Tests to see whether channel does exist

  let flag = 0;

  let channel;

  for (let i = 0; i < currentData.Channels.length; i++) {
    if (channelId === currentData.Channels[i].channelId) {
      channel = currentData.Channels[i];

      flag = 1;
    }
  }

  if (flag === 0) {
    throw HTTPError(400, 'channelId does NOT refer to a valid channel!');
  }

  let userId: number;

  // Tests to see if the user is already a member of the channel --> find associated uId.

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        userId = currentData.Users[i].uId;
      }
    }
  }

  // Loop through channels with uId to see if it is inside

  // Loop through to find channel index via channelId

  for (let i = 0; i < currentData.Channels.length; i++) {
    if (channelId === currentData.Channels[i].channelId) {
      for (let j = 0; j < currentData.Channels[i].members.length; j++) {
        if (userId === currentData.Channels[i].members[j].uId) {
          throw HTTPError(400, 'User is already a member of the channel!');
        }
      }
    }
  }

  // Global Owner can be joined into priv and public

  let userNow;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      // Finding user with the token passed in

      if (token === currentData.Users[i].token[j].sessionId) {
        userNow = currentData.Users[i];
      }
    }
  }

  // If this users permissionId is 1 they are a global owner

  if (userNow.permissionId === 1) {
    const globalUser = {

      uId: userNow.uId,

      email: userNow.email,

      nameFirst: userNow.nameFirst,

      nameLast: userNow.nameLast,

      handleStr: userNow.handleStr

    };

    channel.members.push(globalUser);

    setData(currentData);

    return {};
  }

  // Tests to see if channelId refers to a private channel

  if (channel.isPublic === false) {
    throw HTTPError(403, 'Error - PRIVATE Channel: User does not have permissions!');
  }

  let user = {};

  let userAccess;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userAccess = currentData.Users[i];

        user = {

          uId: currentData.Users[i].uId,

          email: currentData.Users[i].email,

          nameFirst: currentData.Users[i].nameFirst,

          nameLast: currentData.Users[i].nameLast,

          handleStr: currentData.Users[i].handleStr,

        };
      }
    }
  }

  channel.members.push(user);

  // creates the users stat

  const userChannelJoin: number = 0 + userAccess.channelsJoined.length;

  const userChannelTime: number = Math.floor((new Date()).getTime() / 1000);

  const userData = {

    numChannelsJoined: userChannelJoin,

    timeStamp: userChannelTime,

  };

  userAccess.channelsJoined.push(userData);

  setData(currentData);

  return {};
}

/**

  * < The 'channelDetailsV3' function has the purpose providing >
  * < basic details about the channel the user is in such as    >
  * < the name, isPublic (status), ownerMembers and allMembers. >
  * @param { string } token - refers to the randomly given string given to identify sessions  who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * ...
  * @returns { name } - returns a string containing name,
  * @returns { isPublic } - returns a boolean containing if the server is public,
  * @returns { ownerMembers } - returns an array of objects containing ownermembers ,
  * @returns { allMembers } - returns an array of objects containing allmembers, isPublic (channel status), ownerMembers, allMembers.
*/
export function channelDetailsV3(token: string, channelId: number) {
  const currentData = getData();

  // checks if token is valid

  let tokenValid = 0;

  let user;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        tokenValid = 1;

        user = currentData.Users[i].uId;
      }
    }
  }

  if (tokenValid === 0) {
    throw HTTPError(403, 'error');
  }

  // checks if channelId is valid

  let channelValid = 0;

  let channel;

  for (let i = 0; i < currentData.Channels.length; i++) {
    if (currentData.Channels[i].channelId === channelId) {
      channelValid = 1;

      channel = currentData.Channels[i];
    }
  }

  if (channelValid === 0) {
    throw HTTPError(400, 'error');
  }

  let memberValid = 0;

  // checks if user is a member of the channel

  for (let i = 0; i < channel.members.length; i++) {
    if (channel.members[i].uId === user) {
      memberValid = 1;
    }
  }

  if (memberValid === 0) {
    throw HTTPError(403, 'error');
  }

  return {

    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: channel.owners,
    allMembers: channel.members,

  };
}

/**

  * < The 'channelMessagesV3' function has the purpose returning upto 50 messages. >

  *

  * @param { string } token - refers to the sessionId of the individual

  * who called the function.

  * @param { integer } channelId - refers to the unique ID of a specific channel.

  * @param { integer } start - refers to the initial index at which the first message is sent.

  * ...

  *

  * @returns { Array of Objects } - returns an array of objects containing details about the

  * messages such as messageId, uId, message, timeSent as well as the start and end.

*/

export function channelMessagesV3(token: string, channelId: number, start: number): object {
  // dataStore being used to store and retrieve data.

  const data = getData();

  const messages = [];

  let end = 0;

  // Used to store the index that the channel is located in.

  let channelIndex;

  // Used to store the index that the uId is located in for the token.

  let userIndex;

  // Case when start is negative.

  if (start < 0) {
    throw HTTPError(400, 'Can not have a negative value starting position!');
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

  // Checking if channelId exists.

  result = false;

  for (let i = 0; i < data.Channels.length; i++) {
    if (data.Channels[i].channelId === channelId) {
      result = true;

      channelIndex = i;
    }
  }

  if (result !== true) {
    throw HTTPError(400, 'ChannelId does not exist!');
  }

  // Checking if start value is greater than number of messages.

  if (start > data.Channels[channelIndex].messages.length) {
    throw HTTPError(400, 'Start value can not be greater than number of messages!');
  }

  // Checking if authUserId of token is not a member of the channel.

  result = false;

  for (let i = 0; i < data.Channels[channelIndex].members.length; i++) {
    if (data.Channels[channelIndex].members[i].uId === data.Users[userIndex].uId) {
      result = true;
    }
  }

  if (result !== true) {
    throw HTTPError(403, 'User not member of channel!');
  }

  // Checking if starting value equals number of messages.

  if (start === data.Channels[channelIndex].messages.length) {
    return {

      messages: [],

      start: start,

      end: -1,

    };
  }

  // Retrieving messages for messages array and determining end value.

  const startingIndex = start;

  const messageNum = data.Channels[channelIndex].messages.length;

  const messagesRemaining = messageNum - start;

  const tempMessageEnd = start + 50;

  if (messagesRemaining >= 51) {
    end = tempMessageEnd;

    for (let i = startingIndex; i < tempMessageEnd; i++) {
      // check if the owner using it is in the reacts array and change it to true
      for (let j = 0; j < data.Channels[channelIndex].messages[i].reacts[0].uIds.length; j++) {
        if (data.Channels[channelIndex].messages[i].reacts[0].uIds[j] === uId) {
          data.Channels[channelIndex].messages[i].reacts[0].isThisUserReacted = true;
        }
      }
      messages.push(data.Channels[channelIndex].messages[i]);
    }
  } else {
    end = -1;

    for (let i = startingIndex; i < messageNum; i++) {
      // check if the owner using it is in the reacts array and change it to true
      for (let j = 0; j < data.Channels[channelIndex].messages[i].reacts[0].uIds.length; j++) {
        if (data.Channels[channelIndex].messages[i].reacts[0].uIds[j] === uId) {
          data.Channels[channelIndex].messages[i].reacts[0].isThisUserReacted = true;
        }
      }
      messages.push(data.Channels[channelIndex].messages[i]);
    }
  }

  return {

    messages: messages,

    start: start,

    end: end,

  };
}

/**
  * < The 'channelAddOwner2' function has the purpose of adding owners to a channel. >
  *
  * @param { string } token - refers to the sessionId of the individual
  * who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { integer } uId - refers to the uId of the user that is added to the channel.
  * ...
  *
  * @returns {}
*/

export function channelAddOwnerV2(token: string, channelId: number, uId: number) {
  const currentData = getData();

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

  // checks if uId is valid

  let userIndex = 0;

  let user;

  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].uId === uId) {
      userIndex = 1;

      user = {

        uId: currentData.Users[i].uId,

        email: currentData.Users[i].email,

        nameFirst: currentData.Users[i].nameFirst,

        nameLast: currentData.Users[i].nameLast,

        handleStr: currentData.Users[i].handleStr,

      };
    }
  }

  if (userIndex === 0) {
    throw HTTPError(400, 'error');
  }

  // checks if uId refers to a user who is not a member of the channel

  let memberIndex = 0;

  for (let i = 0; i < channel.members.length; i++) {
    if (channel.members[i].uId === uId) {
      memberIndex = 1;
    }
  }

  if (memberIndex === 0) {
    throw HTTPError(400, 'error');
  }

  // checks if uId refers to a user who is already an owner of the channel

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === uId) {
      throw HTTPError(400, 'error');
    }
  }

  // finds the user that owns the token

  let userPermission;
  let tokenIndex = 0;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userPermission = currentData.Users[i].uId;

        tokenIndex = 1;
      }
    }
  }

  if (tokenIndex === 0) {
    throw HTTPError(403, 'error');
  }

  // checks if that said user have owner permission

  let permissionIndex = 0;

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === userPermission) {
      permissionIndex = 1;
    }
  }

  if (userPermission === currentData.Users[0].uId) {
    permissionIndex = 1;
  }

  if (permissionIndex === 0) {
    throw HTTPError(403, 'error');
  }

  // pushes the user into the owners array

  channel.owners.push(user);

  setData(currentData);

  return {};
}

/**
  * < The 'channelRemoveOwner2' function has the purpose of removing owners to a channel. >
  *
  * @param { string } token - refers to the sessionId of the individual
  * who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * @param { integer } uId - refers to the uId of the user that is removed from the channel.
  * ...
  *
  * @returns {}
*/

export function channelRemoveOwnerV2(token: string, channelId: number, uId: number) {
  const currentData = getData();

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

  // checks if uId is valid

  let userIndex = 0;

  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].uId === uId) {
      userIndex = 1;
    }
  }

  if (userIndex === 0) {
    throw HTTPError(400, 'error');
  }

  // checks if uId refers to a user who is NOT an owner of the channel

  let ownerIndex = 0;

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === uId) {
      ownerIndex = 1;
    }
  }

  if (ownerIndex === 0) {
    throw HTTPError(400, 'error');
  }

  // checks if uId refers to a user who is currently the only owner of the channel

  if (channel.owners.length === 1) {
    throw HTTPError(400, 'error');
  }

  // finds the user that owns the token

  let userPermission;
  let tokenIndex = 0;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        userPermission = currentData.Users[i].uId;

        tokenIndex = 1;
      }
    }
  }

  if (tokenIndex === 0) {
    throw HTTPError(403, 'error');
  }

  // checks if that said user have owner permission

  let permissionIndex = 0;

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === userPermission) {
      permissionIndex = 1;
    }
  }

  if (userPermission === currentData.Users[0].uId) {
    permissionIndex = 1;
  }

  if (permissionIndex === 0) {
    throw HTTPError(403, 'error');
  }

  // removes the uid from the owners array

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === uId) {
      channel.owners.splice(i, 1);
    }
  }

  setData(currentData);

  return {};
}

/**
  * < The 'channelLeaveV2' function has the purpose of removing users from a channel. >
  *
  * @param { string } token - refers to the sessionId of the individual
  * who called the function.
  * @param { integer } channelId - refers to the unique ID of a specific channel.
  * ...
  *
  * @returns {}
*/

export function channelLeaveV2(token: string, channelId: number) {
  const currentData = getData();

  // check if given param is an empty string

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

  // checks if token is valid and get the user of said token

  let tokenIndex = 1;
  let user;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        user = currentData.Users[i];
        tokenIndex = 0;
      }
    }
  }
  if (tokenIndex === 1) {
    throw HTTPError(400, 'error');
  }

  // checks if for valid token is a member of the channel, if so remove the member

  for (let i = 0; i < channel.members.length; i++) {
    if (channel.members[i].uId === user.uId) {
      channel.members.splice(i, 1);

      channelIndex = 0;
    }
  }

  if (channelIndex === 1) {
    throw HTTPError(403, 'error');
  }

  // removes the user if they are part of owners

  for (let i = 0; i < channel.owners.length; i++) {
    if (channel.owners[i].uId === user.uId) {
      channel.owners.splice(i, 1);
    }
  }
  // creates the users stat
  const userChannelJoinIndex = user.channelsJoined.length - 1;
  const userChannelJoin = user.channelsJoined[userChannelJoinIndex].numChannelsJoined - 1;
  const userChannelTime = Math.floor((new Date()).getTime() / 1000);
  const userData = {
    numChannelsJoined: userChannelJoin,
    timeStamp: userChannelTime,
  };
  user.channelsJoined.push(userData);
  setData(currentData);

  return {};
}
