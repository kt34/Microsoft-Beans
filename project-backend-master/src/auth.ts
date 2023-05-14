import { getData } from './dataStore';
import { setData } from './dataStore';
import validator from 'validator';
import randomstring from 'randomstring';
import HTTPError from 'http-errors';
import crypto from 'crypto';
import { checkValidToken } from './dm';

// create a hash of a string
function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

// check if the email is valid
function validEmail(email: string) {
  const currentData = getData();

  for (let i = 0; i < currentData.Users.length; i++) {
    if (email === currentData.Users[i].email) {
      return true;
    }
  }

  return false;
}

// check if the resetCode is valid
function validResetCode(resetCode: string) {
  const currentData = getData();

  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].resetCodes.length; j++) {
      if (currentData.Users[i].resetCodes[j] === resetCode) {
        return {
          valid: true,
          index1: i,
          index2: j
        };
      }
    }
  }

  return {
    valid: false,
    index1: 0,
    index2: 0
  };
}

/**
  * <authLoginV3 returns the authUserId and token of a user given both the user's
  *   email and password>
  *
  * @param {String} email - refers to the email of the user
  * @param {String} password - refers to the password of the user
  * ...
  *
  * @returns {object} {authuserid} - refers to the id given to identify users
  * @returns {object} {token} - refers to the randomly given String given to identify sessions
*/

export function authLoginV3(email: string, password: string) {
  // get the data from datastore
  const currentData = getData();

  // check if there is a valid email inside the data
  let validEmail = 0;

  const hashedPassword = getHashOf(password);

  for (let i = 0; i < currentData.Users.length; i++) {
    if (email === currentData.Users[i].email) {
      validEmail = 1;
      if (hashedPassword !== currentData.Users[i].password) {
        throw HTTPError(400, 'error');
      } else {
        const sessionId = randomstring.generate();

        const SECRET = 'bananabread';

        const finalSessionHash = getHashOf(sessionId + SECRET);
        const token = {
          sessionId: finalSessionHash
        };
        currentData.Users[i].token.push(token);

        setData(currentData);

        return {
          token: token.sessionId,
          authUserId: currentData.Users[i].uId
        };
      }
    }
  }

  if (validEmail === 0) {
    throw HTTPError(400, 'error');
  }
}

/**
 * <authRegisterV3 creates an object of all the user information and pushes
 *   this into the data, while returning the authUserId and token >
 *
 * @param {string} email - refers to the email of the user
 * @param {string} password - refers to the password of the user
 * @param {string} nameFirst - refers to the first name of the user
 * @param {string} nameLast - refers to the last name of the user
 * ...
 *
 * @returns {object} {token} - refers to the randomly given String given to identify sessions
 * @returns {object} {authuserid} - refers to the id given to identify users
*/

export function authRegisterV3(email: string, password: string, nameFirst: string, nameLast: string) {
  // check email validity first
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'error');
  }

  // check length of password
  if (password.length < 6) {
    throw HTTPError(400, 'error');
  }

  // check name of length first between 1 and 50
  if (nameFirst.length > 50) {
    throw HTTPError(400, 'error');
  }

  if (nameFirst.length < 1) {
    throw HTTPError(400, 'error');
  }

  // check name of length last between 1 and 50
  if (nameLast.length > 50 || nameLast.length < 1) {
    throw HTTPError(400, 'error');
  }

  // get all the current data from datastore.js
  const currentData = getData();

  const authUserId = 1000 + 5 * (currentData.Users.length);

  // check if the email is already in use by looping through data
  if (currentData.Users.length > 0) {
    for (let i = 0; i < currentData.Users.length; i++) {
      if (currentData.Users[i].email === email) {
        throw HTTPError(400, 'error');
      }
    }
  }

  // when first ever user registers create work stat fields and set it to 0
  if (currentData.Users.length === 0) {
    // creates the workspace stat
    const workChannelExist = 0;
    const workTime = Math.floor((new Date()).getTime() / 1000);
    const workDataChannels = {
      numChannelsExist: workChannelExist,
      timeStamp: workTime,
    };
    currentData.WorkSpace.channelsExist.push(workDataChannels);

    const workDmExist = 0;
    const workDataDms = {
      numDmsExist: workDmExist,
      timeStamp: workTime
    };
    currentData.WorkSpace.dmsExist.push(workDataDms);

    const workMsgsExist = 0;
    const workDataMsgs = {
      numMessagesExist: workMsgsExist,
      timeStamp: workTime
    };
    currentData.WorkSpace.messagesExist.push(workDataMsgs);
  }
  // declare handlestr
  let handleStr;

  // make first and last name lower case
  const nameFirstLower = nameFirst.toLowerCase();
  const nameLastLower = nameLast.toLowerCase();

  // get rid of all non alphanumeric from both first and last name
  const finalFirstName = nameFirstLower.replace(/[^0-9a-z]/gi, '');
  const finalLastName = nameLastLower.replace(/[^0-9a-z]/gi, '');

  // combine the two names together in one String
  handleStr = finalFirstName.concat(finalLastName);

  // check if length is over 20 and if so slice to 20 length
  if (handleStr.length > 20) {
    handleStr = handleStr.substring(0, 19);
  }

  // check if the handlestr is already taken
  let counter = -1;
  for (let i = 0; i < currentData.Users.length; i++) {
    if (currentData.Users[i].nameFirst === finalFirstName && currentData.Users[i].nameLast === finalLastName) {
      counter++;
    }
  }

  // if there is duplicates add the next handle number to the end of the handlestr
  if (counter > -1) {
    const duplicateNumber = counter.toString();
    handleStr = handleStr.concat(duplicateNumber);
  }

  // get a sessionId and hash it
  const sessionId = randomstring.generate();

  const SECRET = 'bananabread';

  const finalSessionHash = getHashOf(sessionId + SECRET);

  const token = {
    sessionId: finalSessionHash,
  };

  // create a hash of the password to store into the data
  const finalPassword = getHashOf(password);

  // assign the new data and push into the old data
  const newData = {
    uId: authUserId,
    email: email,
    nameFirst: finalFirstName,
    nameLast: finalLastName,
    handleStr: handleStr,
    password: finalPassword,
    profileImgUrl: '',
    token: [],
    channelsJoined: [],
    dmsJoined: [],
    messagesSent: [],
    resetCodes: [],
    permissionId: 2,
    notifications: []
  };

  if (currentData.Users.length === 0) {
    newData.permissionId = 1;
  }

  newData.token.push(token);

  currentData.Users.push(newData);

  // creates the users stat
  const userChannelJoin = 0;
  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  const userData = {
    numChannelsJoined: userChannelJoin,
    timeStamp: timeStamp,
  };

  newData.channelsJoined.push(userData);

  const userDmJoin = 0;
  const dmsJoinedData = {
    numDmsJoined: userDmJoin,
    timeStamp: timeStamp
  };

  newData.dmsJoined.push(dmsJoinedData);

  const userMessages = 0;
  const messagesData = {
    numMessagesSent: userMessages,
    timeStamp: timeStamp
  };

  newData.messagesSent.push(messagesData);

  setData(currentData);

  return {
    authUserId: authUserId,
    token: finalSessionHash
  };
}

/**
  * <authLogoutV2 logouts a token from both the user array and sessionId, logging out the entire
  * session>
  *
  * @param {String} token - refers to the randomly given String given to identify sessions
  * ...
  *
  * @returns {}
*/

export function authLogoutV2(token: string) {
  const currentData = getData();

  const validToken = checkValidToken(token);

  if (!validToken) {
    throw HTTPError(403, 'error');
  }

  // token must be valid now
  for (let i = 0; i < currentData.Users.length; i++) {
    for (let j = 0; j < currentData.Users[i].token.length; j++) {
      if (currentData.Users[i].token[j].sessionId === token) {
        currentData.Users[i].token.splice(j, 1);
      }
    }
  }

  setData(currentData);

  return {};
}

/**
  * <authPasswordResetRequestV1 creates a reset request incase user forgets password
  *
  * @param {String} email - refers to the email of the user
  * ...
  *
  * @returns {}
*/
export function authPasswordResetRequestV1(email: string) {
  // check if valid email
  if (!validEmail(email)) {
    return {};
  }

  // now it is a valid email, send the email
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    auth: {
      user: 'bob@gmail.com',
      pass: 'bananabreadhello'
    }
  });

  const resetCode = randomstring.generate();

  const emailData = {
    from: 'bob@gmail.com',
    to: email,
    subject: 'Your Reset Code for Password',
    text: resetCode
  };

  transporter.sendMail(emailData, function(info: any) {
    console.log('message has been sent');
  });

  // add the resetCode to all data
  const currentData = getData();

  for (let i = 0; i < currentData.Users.length; i++) {
    if (email === currentData.Users[i].email) {
      currentData.Users[i].token = [];
      currentData.Users[i].resetCodes.push(resetCode);
    }
  }

  return {};
}

/**
  * <authPasswordResetResetV1 resets a password and create a new password
  *
  * @param {number} resetCode - number identifying the correct resetcode
  * @param {string} newPassword - string containing the new password of the user
  * ...
  *
  * @returns {}
*/
export function authPasswordResetResetV1(resetCode: string, newPassword: string) {
  const validReset = validResetCode(resetCode);

  if (!validReset.valid) {
    throw HTTPError(400, 'error');
  }

  if (newPassword.length < 6) {
    throw HTTPError(400, 'error');
  }

  const currentData = getData();

  const finalPassword = getHashOf(newPassword);

  currentData.Users[validReset.index1].password = finalPassword;

  currentData.Users[validReset.index1].resetCodes.splice(validReset.index2, 1);

  return {};
}
