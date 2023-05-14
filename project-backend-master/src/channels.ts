import { getData } from './dataStore';
import { setData } from './dataStore';
import { checkValidToken } from './dm';
import HTTPError from 'http-errors';

/**
  * channelsListV3 <Provides an array of all channels (and their associated details) that the authorised user is part of.>
  *
  * @param {string} token - refers to the sessionId of the individual who called the function.
  *...
  * @returns [{}] channels - refers to the array of channels
*/

export function channelsListV3(token: string) {
  // checks if function was given empty string

  const currentData = getData();

  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  let user;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        user = currentData.Users[i].uId;
      }
    }
  }

  const channelsData = [];
  // iterates from the data.channel array
  for (let i = 0; i < currentData.Channels.length; i++) {
    // iterates for each member of channel[i]
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      // check if member exist in the channel
      if (currentData.Channels[i].members[j].uId === user) {
        const newData = {
          channelId: currentData.Channels[i].channelId,
          name: currentData.Channels[i].name
        };
        channelsData.push(newData);
      }
    }
  }

  return { channels: channelsData };
}

/**
  * channelsCreateV3 <Creates a new channel with the given name, that is either a public or private channel. The user who created it automatically joins the channel.>
  *
  * @param {integer} token - the random string of the user creating the channel.
  * @param {string} name - the name of the channel.
  * @param {boolean} isPublic - if the channel is public or private.
  *
  * @returns {integer} channelId - a unique set of interger for channels.
*/

export function channelsCreateV3(token: string, name: string, isPublic: boolean) {
  const currentData = getData();

  // edge case name less than 1 or more than 20
  if ((name.length > 20) || (name.length < 1)) {
    throw HTTPError(400, 'error');
  }

  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
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

  // creates channelId
  const channelId = -1000 - 5 * (currentData.Channels.length);

  const newData = {
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    owners: [],
    members: [],
    messages: [],
    standUp: {
      messages: [],
      startingTime: 0,
      endingTime: 0
    }
  };

  // creates the users stat
  const userChannelJoinIndex = userAccess.channelsJoined.length - 1;
  const userChannelJoin = userAccess.channelsJoined[userChannelJoinIndex].numChannelsJoined + 1;
  const userChannelTime = Math.floor((new Date()).getTime() / 1000);
  const userData = {
    numChannelsJoined: userChannelJoin,
    timeStamp: userChannelTime,
  };
  userAccess.channelsJoined.push(userData);

  // creates the workspace stat
  const workChannelJoinIndex = currentData.WorkSpace.channelsExist.length - 1;
  const workChannelJoin = currentData.WorkSpace.channelsExist[workChannelJoinIndex].numChannelsExist + 1;
  const workChannelTime = Math.floor((new Date()).getTime() / 1000);
  const workData = {
    numChannelsExist: workChannelJoin,
    timeStamp: workChannelTime,
  };
  currentData.WorkSpace.channelsExist.push(workData);

  newData.owners.push(user);
  newData.members.push(user);
  currentData.Channels.push(newData);
  setData(currentData);

  return {
    channelId: channelId,
  };
}

/**
  * channelsListAllV3 <Provides an array of all channels, including private channels (and their associated details)>
  *
  * @param {string} token - the Id of the user.
  *...
  * @returns [{}] channels - refers to the array of channels
*/

export function channelsListAllV3(token: string) {
  // checks if function was given empty string

  const currentData = getData();

  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  const channelsData = [];
  for (let i = 0; i < currentData.Channels.length; i++) {
    const newData = {
      channelId: currentData.Channels[i].channelId,
      name: currentData.Channels[i].name
    };
    channelsData.push(newData);
  }

  return { channels: channelsData };
}
