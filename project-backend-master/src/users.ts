import { getData } from './dataStore';
import { setData } from './dataStore';
import config from './config.json';
import validator from 'validator';
import request from 'sync-request';
import { checkValidToken } from './dm';
import randomstring from 'randomstring';
import HTTPError from 'http-errors';
import fs from 'fs';
import jimp from 'jimp';

/**
  * < The 'userProfileV2' function returns information about >
  * < a valid user including their user ID, email, first name, >
  * < last name and handle.                                  >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { integer } uId - refers to the uId of the individual who
  * has been called.
  * ...
  *
  * @returns { Object } - returns an object containing the details
  * of the uId called including uId, email, nameFirst, nameLast and the handleStr.
  *
*/
interface userObject {

  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  profileImgUrl: string

}

export function userProfileV3 (token: string, uId: number): object {
  const currentData = getData();

  let tokenFlag = 0;
  let uidFlag = 0;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        tokenFlag = 1;
      }
    }

    if (uId === currentData.Users[i].uId) {
      uidFlag = 1;
    }
  }

  if (tokenFlag === 0) {
    throw HTTPError(403, 'token is invalid');
  }

  if (uidFlag === 0) {
    throw HTTPError(400, 'uId is invalid');
  }

  let currentUser: userObject;

  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].uId === uId) {
      currentUser = {
        uId: currentData.Users[i].uId,
        email: currentData.Users[i].email,
        nameFirst: currentData.Users[i].nameFirst,
        nameLast: currentData.Users[i].nameLast,
        handleStr: currentData.Users[i].handleStr,
        profileImgUrl: currentData.Users[i].profileImgUrl
      };
      return { user: currentUser };
    }
  }
}

/**
  * < The 'userListAllV1' function returns information about >
  * < all users including their user ID, email, first name, >
  * < last name and handle.                                  >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * ...
  *
  * @returns { Object } - returns an object containing the details
  * of the uId called including uId, email, nameFirst, nameLast and the handleStr.
  *
*/

export function userListAllV2 (token: string): object {
  const currentData = getData();

  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid');
  }

  const nonRemovedUsers: Array<userObject> = [];

  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].email.length !== 0) {
      nonRemovedUsers.push(currentData.Users[i]);
    }
  }

  // Delete password on user interface.
  const usersArray: Array<userObject> = [];
  let currentUser: userObject;

  for (let i = 0; i < nonRemovedUsers.length; i++) {
    currentUser = {
      uId: nonRemovedUsers[i].uId,
      email: nonRemovedUsers[i].email,
      nameFirst: nonRemovedUsers[i].nameFirst,
      nameLast: nonRemovedUsers[i].nameLast,
      handleStr: nonRemovedUsers[i].handleStr,
      profileImgUrl: nonRemovedUsers[i].profileImgUrl
    };
    usersArray.push(currentUser);
  }

  return { users: usersArray };
}

/**
  * < The 'userSetNameV2' allows an individual to change their >
  * < first and last name on their profile.                    >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { string } nameFirst - refers to the first name of the individual
  * who called the function.
  * @param { string } nameLast - refers to the last name of the individual
  * who called the function.
  * ...
  *
  * @returns { Object } - that is empty to indicate success otherwise returns an error.
  *
*/
export function userSetNameV2 (token: string, nameFirst: string, nameLast: string): object {
  // Test to see if token is valid.
  const currentData = getData();
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // check name length validity
  if (nameFirst.length > 50 || nameFirst.length < 1) {
    throw HTTPError(400, 'First name length is invalid!');
  }

  // check name of length last between 1 and 50
  if (nameLast.length > 50 || nameLast.length < 1) {
    throw HTTPError(400, 'Last name length is invalid!');
  }

  const nameFirstLower: string = nameFirst.toLowerCase();
  const nameLastLower: string = nameLast.toLowerCase();

  // get rid of all non alphanumeric from both first and last name
  const finalFirstName: string = nameFirstLower.replace(/[^0-9a-z]/gi, '');
  const finalLastName: string = nameLastLower.replace(/[^0-9a-z]/gi, '');

  // Change the name for the profile
  let userId: number;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        userId = currentData.Users[i].uId;
        currentData.Users[i].nameFirst = finalFirstName;
        currentData.Users[i].nameLast = finalLastName;
      }
    }
  }

  // change the name in the channels
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].owners.length; j++) {
      if (currentData.Channels[i].owners[j].uId === userId) {
        currentData.Channels[i].owners[j].nameFirst = finalFirstName;
        currentData.Channels[i].owners[j].nameLast = finalLastName;
      }
    }
  }

  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      if (currentData.Channels[i].members[j].uId === userId) {
        currentData.Channels[i].members[j].nameFirst = finalFirstName;
        currentData.Channels[i].members[j].nameLast = finalLastName;
      }
    }
  }

  setData(currentData);
  return {};
}

/**
  * < The 'userSetEmailV2' function allows an individual to change the email >
  * < associated to their account.                                            >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { string } email - refers to the email the individual wishes to change to.
  * ...
  *
  * @returns { Object } - that is empty to indicate success otherwise returns an error.
  *
*/
export function userSetEmailV2 (token: string, email: string): object {
  const currentData = getData();

  // check email validity first
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Email is invalid!');
  }

  // Check if email is already in use
  let emailFlag = 0;

  for (let increment = 0; increment < currentData.Users.length; increment++) {
    if (email === currentData.Users[increment].email) {
      emailFlag = 1;
    }
  }

  if (emailFlag === 1) {
    throw HTTPError(400, 'Email is already in use!');
  }

  // error checking to see if the token is valid.
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // Chnage the user email
  let userId: number;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        userId = currentData.Users[i].uId;
        currentData.Users[i].email = email;
        setData(currentData);
      }
    }
  }

  // change the email in the channels
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].owners.length; j++) {
      if (currentData.Channels[i].owners[j].uId === userId) {
        currentData.Channels[i].owners[j].email = email;
      }
    }
  }

  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      if (currentData.Channels[i].members[j].uId === userId) {
        currentData.Channels[i].members[j].email = email;
      }
    }
  }

  setData(currentData);
  return {};
}

/**
  * < The 'userSetHandleV2' function allows an individual to change the handle >
  * < associated to their account.                                              >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { string } handleStr - refers to the handle the user wishes to change to.
  * ...
  *
  * @returns { Object } - that is empty to indicate success otherwise returns an error.
  *
*/
export function userSetHandleV2 (token: string, handleStr: string): object {
  const currentData = getData();

  // Check if length of handlestr is ok
  if (!(handleStr.length <= 20 && handleStr.length >= 3)) {
    throw HTTPError(400, 'Handle string length is invalid!');
  }

  // check for non alphanumeric characters
  if (handleStr.match(/^[0-9A-Za-z]+$/) === null) {
    throw HTTPError(400, 'Handle string contains non-alphanumeric characters!');
  }

  // check if handlestr is already taken
  for (let increment = 0; increment < currentData.Users.length; increment++) {
    if (handleStr === currentData.Users[increment].handleStr) {
      throw HTTPError(400, 'Handle string is already in use!');
    }
  }

  // error checking to see if the token is valid.
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // Change User handle
  let userId: number;
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        userId = currentData.Users[i].uId;
        currentData.Users[i].handleStr = handleStr;
        setData(currentData);
      }
    }
  }

  // change the handleStr in the channels
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].owners.length; j++) {
      if (currentData.Channels[i].owners[j].uId === userId) {
        currentData.Channels[i].owners[j].handleStr = handleStr;
      }
    }
  }

  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      if (currentData.Channels[i].members[j].uId === userId) {
        currentData.Channels[i].members[j].handleStr = handleStr;
      }
    }
  }

  setData(currentData);
  return {};
}

// Helper Functions
function isMemberOfDm (userId: number, positionOfDm: number): boolean {
  const currentData = getData();

  for (let i = 0; i < currentData.Dms[positionOfDm].members.length; i++) {
    if (userId === currentData.Dms[positionOfDm].members[i]) {
      return true;
    }
  }

  return false;
}

function isMemberOfChannel (userId: number, positionOfChannel: number): boolean {
  const currentData = getData();

  for (let i = 0; i < currentData.Channels[positionOfChannel].members.length; i++) {
    if (userId === currentData.Channels[positionOfChannel].members[i].uId) {
      return true;
    }
  }

  return false;
}

interface Stats {

  channelsJoined: Record<string, unknown>[];
  dmsJoined: Record<string, unknown>[];
  messagesSent: Record<string, unknown>[];
  involvementRate: number;

}

/**
  * < The 'userStatsV1' function allows an individual to view their user statistics >
  * < associated with their account.                                                >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * ...
  *
  * @returns { Object } - returns an object containing number of channels & DMs joined,
  * messages sent and their involvement rate.
  *
*/
export function userStatsV1 (token: string): object {
  const currentData = getData();
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  let userStats: Stats;
  let userIndex: number;
  let userId: number;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        userIndex = i;
        userId = currentData.Users[i].uId;
        userStats = {
          channelsJoined: currentData.Users[i].channelsJoined,
          dmsJoined: currentData.Users[i].dmsJoined,
          messagesSent: currentData.Users[i].messagesSent,
          involvementRate: 0
        };
      }
    }
  }

  const indexOfLastChannel: number = userStats.channelsJoined.length - 1;
  const finalNumChannels: number = currentData.Users[userIndex].channelsJoined[indexOfLastChannel].numChannelsJoined;

  const indexOfLastDm: number = userStats.dmsJoined.length - 1;
  const finalNumDms: number = currentData.Users[userIndex].dmsJoined[indexOfLastDm].numDmsJoined;

  let numDmsSent = 0;
  let numTotalDms = 0;
  let numDms = 0;

  for (let i = 0; i < currentData.Dms.length; i++) {
    if (isMemberOfDm(userId, i) === true) {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        if (userId === currentData.Dms[i].messages[j].uId) {
          numDmsSent++;
        }
        numTotalDms++;
      }
    } else {
      for (let j = 0; j < currentData.Dms[i].messages.length; j++) {
        // number of total dms user is not part of
        numTotalDms++;
      }
    }
    numDms++;
  }

  let numOfChannelMessagesSent = 0;
  let numTotalChannelMessages = 0;
  let numChannels = 0;

  for (let i = 0; i < currentData.Channels.length; i++) {
    if (isMemberOfChannel(userId, i) === true) {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        if (userId === currentData.Channels[i].messages[j].uId) {
          numOfChannelMessagesSent++;
        }
        // number of total messages in a channel that a user is part of
        numTotalChannelMessages++;
      }
    } else {
      for (let j = 0; j < currentData.Channels[i].messages.length; j++) {
        // number of total messages in a channel that a user is not part of
        numTotalChannelMessages++;
      }
    }
    numChannels++;
  }

  const numMsgsSent: number = numDmsSent + numOfChannelMessagesSent;
  const numMsgs: number = numTotalDms + numTotalChannelMessages;

  const newInvolvementRate: number = (finalNumChannels + finalNumDms + numMsgsSent) / (numChannels + numDms + numMsgs);
  userStats.involvementRate = newInvolvementRate;

  return { userStats: userStats };
}

/**
  * < The 'usersStatsV1' function allows an individual to view statistics >
  * < about the workspace's use of UNSW Beans.                            >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * ...
  *
  * @returns { Object } - returns an object containing number of channels, DMs &
  * messages existing and their utilisation rate
  *
*/

interface workStats {

  channelsExist: object[],
  dmsExist: object[],
  messagesExist: object[],
  utilizationRate: number

}

export function usersStatsV1 (token: string): object {
  const currentData = getData();
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  let numUsersWhoHaveJoinedAtLeastOneChannelOrDm = 0;
  const numUsers: number = currentData.Users.length;

  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].channelsJoined.length > 1 || currentData.Users[i].dmsJoined.length > 1) {
      numUsersWhoHaveJoinedAtLeastOneChannelOrDm++;
    }
  }

  const utilizationRate: number = numUsersWhoHaveJoinedAtLeastOneChannelOrDm / numUsers;

  const workSpaceStats: workStats = {
    channelsExist: currentData.WorkSpace.channelsExist,
    dmsExist: currentData.WorkSpace.dmsExist,
    messagesExist: currentData.WorkSpace.messagesExist,
    utilizationRate: utilizationRate,
  };

  return { workspaceStats: workSpaceStats };
}

/**
  * < The 'adminUserRemoveV1' function allows a global owner to remove a member >
  * < completely off of the platform.                                           >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { number } uId - refers to the ID of an individual.
  * ...
  *
  * @returns { Object } - that is empty to indicate success otherwise returns an error.
  *
*/
export function adminUserRemoveV1 (token: string, uId: number): object {
  const currentData = getData();
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // check to see if uId refers to a valid user
  let isUidValid = false;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId) {
      isUidValid = true;
    }
  }

  if (isUidValid === false) {
    throw HTTPError(400, 'uId does not refer to a valid user!');
  }

  // now check their permission id--> is it 1
  let uIdMatchesToken = false;
  let globalOwnerCount = 0;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId && currentData.Users[i].permissionId === 1) {
      for (let j = 0; j < currentData.Users[i].token.length; j++) {
        if (token === currentData.Users[i].token[j].sessionId) {
          uIdMatchesToken = true;
        }
      }

      globalOwnerCount++;
    } else if (currentData.Users[i].permissionId === 1) {
      globalOwnerCount++;
    }
  }

  if (globalOwnerCount === 1 && uIdMatchesToken === true) {
    throw HTTPError(400, 'uId refers to the ONLY global owner!');
  }

  let indexOfAuth: number;
  let authUserId: number;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        indexOfAuth = i;
        authUserId = currentData.Users[i].uId;
      }
    }
  }

  if (currentData.Users[indexOfAuth].permissionId !== 1) {
    throw HTTPError(403, 'The authorised user is not a global owner!');
  }

  // This removes user from channel members and changes message content
  for (let i = 0; i < currentData.Channels.length; i++) {
    for (let j = 0; j < currentData.Channels[i].members.length; j++) {
      if (uId === currentData.Channels[i].members[j].uId) {
        currentData.Channels[i].members.splice(j, 1);
        // check to see if member is also an owner
        for (let z = 0; z < currentData.Channels[i].owners.length; z++) {
          if (uId === currentData.Channels[i].owners[z].uId) {
            currentData.Channels[i].owners.splice(z, 1);
          }
        }
        // now change all their message content
        for (let k = 0; k < currentData.Channels[i].messages.length; k++) {
          if (uId === currentData.Channels[i].messages[k].uId) {
            currentData.Channels[i].messages[k].message = 'Removed User';
          }
        }
      }
    }
  }

  // assuming global owner cant remove person from dm they are not part of themself
  for (let i = 0; i < currentData.Dms.length; i++) {
    for (let j = 0; j < currentData.Dms[i].members.length; j++) {
      // checks to see if global owner is part of this dm
      if (currentData.Dms[i].members[j] === authUserId) {
        for (let k = 0; k < currentData.Dms[i].members.length; k++) {
          if (uId === currentData.Dms[i].members[k]) {
            currentData.Dms[i].members.splice(k, 1);

            for (let z = 0; z < currentData.Dms[i].messages.length; z++) {
              if (uId === currentData.Dms[i].messages[z].uId) {
                currentData.Dms[i].messages[z].message = 'Removed User';
              }
            }
          }
        }

        // check to see if the person is also an owner of the dm
        if (uId === currentData.Dms[i].owner) {
          // currentData.Dms[i].delete.owner;
        }
      }
    }
    // if (currentData.Dms[i].members
  }

  // Now set the appropriate fields for this removed user in the dataStore.
  for (let i = 0; currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId) {
      currentData.Users[i].nameFirst = 'Removed';
      currentData.Users[i].nameLast = 'User';
      currentData.Users[i].email = '';
      currentData.Users[i].handleStr = '';
      break;
    }
  }

  return {};
}

/**
  * < The 'adminUserPermissionChangeV1' function allows a global owner to promote >
  * < or demote a member of the platform.                                         >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { number } uId - refers to the ID of an individual.
  * @param { number } permissionId - refers to the ID of an individual defining their
  * permissions as either being a member or owner.
  * ...
  *
  * @returns { Object } - that is empty to indicate success otherwise returns an error.
  *
*/
export function adminUserPermissionChangeV1 (token: string, uId: number, permissionId: number): object {
  const currentData = getData();
  const validToken: boolean = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'token is invalid!');
  }

  // check to see if uId refers to a valid user
  let isUidValid = false;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId) {
      isUidValid = true;
    }
  }

  if (isUidValid === false) {
    throw HTTPError(400, 'uId does not refer to a valid user!');
  }

  // only global owner attempting to be demoted to user
  // now check their permission id--> is it 1
  let uIdMatchesToken = false;
  let globalOwnerCount = 0;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId && currentData.Users[i].permissionId === 1) {
      for (let j = 0; j < currentData.Users[i].token.length; j++) {
        if (token === currentData.Users[i].token[j].sessionId) {
          uIdMatchesToken = true;
        }
      }

      globalOwnerCount++;
    } else if (currentData.Users[i].permissionId === 1) {
      globalOwnerCount++;
    }
  }

  if (globalOwnerCount === 1 && uIdMatchesToken === true) {
    throw HTTPError(400, 'uId refers to the ONLY global owner!');
  }

  let indexOfAuth: number;

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (token === currentData.Users[i].token[j].sessionId) {
        indexOfAuth = i;
      }
    }
  }

  if (currentData.Users[indexOfAuth].permissionId !== 1) {
    throw HTTPError(403, 'The authorised user is not a global owner!');
  }

  // permissionId is invalid
  if (permissionId < 1 || permissionId > 2) {
    throw HTTPError(400, 'permissionId is invalid!');
  }

  // if uid already has permissionId of owner
  let isCorrectPermissionId = false;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId) {
      if (currentData.Users[i].permissionId !== permissionId) {
        isCorrectPermissionId = true;
      }
    }
  }

  if (isCorrectPermissionId === false) {
    throw HTTPError(400, 'User already has that permissionId!');
  }

  for (let i = 0; i < currentData.Users.length; i++) {
    if (uId === currentData.Users[i].uId) {
      currentData.Users[i].permissionId = permissionId;
    }
  }

  return {};
}

/**
  * < The 'uploadPhotoV1' function given a URL of an image, >
  * < crops the image within the appropriate bounds.        >
  *
  * @param { string } token - refers to the unique token of the individual
  * who called the function.
  * @param { integer } xStart - refers to starting width position.
  * @param { integer } xEnd - refers to ending width position.
  * @param { integer } yStart - refers to start height position.
  * @param { integer } yEnd - refers to ending height position.
  * @param { string } imgUrl - refers to the string URL of the image
  * ...
  *
  * @returns { Object } - returns an object containing the details
  * of the uId called including uId, email, nameFirst, nameLast and the handleStr.
  *
*/
export function uploadPhotoV1(token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  // error checking to see if the token is valid.
  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'invalid token');
  }

  // check that the imageurl is a jpeg
  const indexJpg = imgUrl.length - 4;
  if (imgUrl[indexJpg] !== '.' || imgUrl[indexJpg + 1] !== 'j' || imgUrl[indexJpg + 2] !== 'p' || imgUrl[indexJpg + 3] !== 'g') {
    throw HTTPError(400, 'not a jpeg');
  }

  // checking
  if (xEnd <= xStart || yEnd <= yStart) {
    throw HTTPError(400, 'end < start');
  }

  const res = request(
    'GET',
    imgUrl
  );
  if (res.statusCode !== 200) {
    throw HTTPError(400, 'resStatusCode invalid');
  }
  const body = res.getBody();
  const nameUncroppedFile = 'static/uncropped' + randomstring.generate() + '.jpg';
  fs.writeFileSync(nameUncroppedFile, body, { flag: 'w' });

  const sizeOf = require('image-size');
  const dimensions = sizeOf(nameUncroppedFile);
  if (xStart < 0 || yStart < 0 || xStart > dimensions.width || yStart > dimensions.length) {
    throw HTTPError(400, 'dimensions invalid');
  }
  if (xEnd < 0 || yEnd < 0 || xEnd > dimensions.width || yEnd > dimensions.length) {
    throw HTTPError(400, 'dimensions invalid');
  }

  const currentData = getData();
  const nameCroppedFile = 'static/cropped' + randomstring.generate() + '.jpg';
  jimp.read(nameUncroppedFile).then((image) => {
    image.crop(xStart, yStart, xEnd - xStart, yEnd - yStart)
      .write(nameCroppedFile);

    const PORT: number = parseInt(process.env.PORT || config.port);

    const finalUrl = 'http://localhost:' + PORT + nameCroppedFile;

    for (let i = 0; i < currentData.Users.length; i++) {
      for (let j = 0; j < currentData.Users[i].token.length; j++) {
        if (currentData.Users[i].token[j].sessionId === token) {
          currentData.Users[i].profileImgUrl = finalUrl;
        }
      }
    }
  });

  setData(currentData);
  return {};
}
