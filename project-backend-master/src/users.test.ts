import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

const clear = () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {
      },
    }
  );
};

const register = (email, password, nameFirst, nameLast) => {
  const res = request(
    'POST',
    `${url}:${port}/auth/register/v3`,
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userRegister = JSON.parse(res.body as string);
  return userRegister;
};

const join = (token, channelId) => {
  const res = request(
    'POST',
    `${url}:${port}/channel/join/v3`,
    {
      json: {
        channelId: channelId,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const channelJoin = JSON.parse(res.body as string);
  return channelJoin;
};

const userProfileDetails = (token, uId) => {
  const res = request(
    'GET',
    `${url}:${port}/user/profile/v3`,
    {
      qs: {
        uId: uId,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userProfileResult = JSON.parse(res.body as string);
  return userProfileResult;
};

const userAllDetails = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/users/all/v2`,
    {
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const usersAllResult = JSON.parse(res.body as string);
  return usersAllResult;
};

const userSetName = (token, nameFirst, nameLast) => {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/setname/v2`,
    {
      json: {
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userSetNameResult = JSON.parse(res.body as string);
  return userSetNameResult;
};

const userSetEmail = (token, email) => {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/setemail/v2`,
    {
      json: {
        email: email,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userSetEmailResult = JSON.parse(res.body as string);
  return userSetEmailResult;
};

const userSetHandle = (token, handleStr) => {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/sethandle/v2`,
    {
      json: {
        handleStr: handleStr,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userSetEmailResult = JSON.parse(res.body as string);
  return userSetEmailResult;
};

const channelCreate = (token, name, isPublic) => {
  const res = request(
    'POST',
    `${url}:${port}/channels/create/v3`,
    {
      json: {
        name: name,
        isPublic: isPublic,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const channel = JSON.parse(res.body as string);
  return channel;
};

const adminUserRemove = (token, uId) => {
  const res = request(
    'DELETE',
    `${url}:${port}/admin/user/remove/v1`,
    {
      qs: {
        uId: uId,
      },
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userAdminRemoveResult = JSON.parse(res.body as string);
  return userAdminRemoveResult;
};

const dmCreate = (token, uIds) => {
  const res = request(
    'POST',
    `${url}:${port}/dm/create/v2`,
    {
      json: {
        uIds: uIds,
      },
      headers: {
        token: token
      },
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const newDmCreate = JSON.parse(res.body as string);
  return newDmCreate;
};

const sendDm = (token, dmId, message) => {
  const res = request(
    'POST',
    `${url}:${port}/message/senddm/v1`,
    {
      json: {
        dmId: dmId,
        message: message,
      },
      headers: {
        token: token
      },
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const messageSent = JSON.parse(res.body as string);
  return messageSent;
};

const sendChannelMsg = (token, channelId, message) => {
  const res = request(
    'POST',
    `${url}:${port}/message/send/v1`,
    {
      json: {
        channelId: channelId,
        message: message,
      },
      headers: {
        token: token
      },
    }

  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const messageSent = JSON.parse(res.body as string);
  return messageSent;
};

const adminUserPermissionChange = (token, uId, permissionId) => {
  const res = request(
    'POST',
    `${url}:${port}/admin/userpermission/change/v1`,
    {
      json: {
        uId: uId,
        permissionId: permissionId,
      },
      headers: {
        token: token
      },
    }

  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const adminUserPermissionChangeResult = JSON.parse(res.body as string);
  return adminUserPermissionChangeResult;
};

const userStats = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/user/stats/v1`,
    {
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const userStatsResult = JSON.parse(res.body as string);
  return userStatsResult;
};

const usersStatsAll = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/users/stats/v1`,
    {
      headers: {
        token: token
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const usersStatsAllResult = JSON.parse(res.body as string);
  return usersStatsAllResult;
};

const uploadPhoto = (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) => {
  const res = request(
    'POST',
    `${url}:${port}/user/profile/uploadphoto/v1`,
    {
      json: {
        imgUrl: imgUrl,
        xStart: xStart,
        yStart: yStart,
        xEnd: xEnd,
        yEnd: yEnd
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  const uploaded = JSON.parse(res.body as string);
  return uploaded;
};

beforeEach(() => {
  clear();
});
// Tests for userProfileV2
describe('Testing \'userProfilev3\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts) | TEST 1:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    // Registers third user and obtains their uId.
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdUid = thirdUser.authUserId;

    const userDetails = userProfileDetails(secondToken, thirdUid);
    expect(userDetails).toStrictEqual({
      user: {
        uId: 1010,
        email: 'bhelloworld@gmail.com',
        nameFirst: 'light',
        nameLast: 'bulb',
        handleStr: 'lightbulb',
        profileImgUrl: expect.any(String)
      }
    });
  });

  test('Passing in Normal Parameters (Just TWO Accounts) | TEST 2:', () => {
    // Registers first user and obtains their token.
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their uId.
    const secondUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const secondUid = secondUser.authUserId;

    const userDetails = userProfileDetails(firstToken, secondUid);
    expect(userDetails).toStrictEqual({
      user: {
        uId: 1005,
        email: 'bhelloworld@gmail.com',
        nameFirst: 'light',
        nameLast: 'bulb',
        handleStr: 'lightbulb',
        profileImgUrl: expect.any(String)
      }
    });
  });

  test('Passing in an Invalid uId | TEST 3:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    // Registers third user and obtains their uId.
    register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    const userDetails = userProfileDetails(secondToken, -6921);
    expect(userDetails).toStrictEqual(400);
  });

  test('Passing in an Invalid Token | TEST 4:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their uId.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userDetails = userProfileDetails('-32kjkBY7SHNSD7SXssa', secondUser.authUserId);
    expect(userDetails).toStrictEqual(403);
  });

  test('Passing in NO Parameters | TEST 5:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userDetails = userProfileDetails('', '');
    expect(userDetails).toStrictEqual(403);
  });

  test('Passing in ONE parameter | TEST 6:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their uId.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userDetails = userProfileDetails('', secondUser.authUserId);
    expect(userDetails).toStrictEqual(403);
  });
});

// Tests for userListAllV1
describe('Testing \'userListAllV2\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts) | TEST 1:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    const userAll = userAllDetails(secondToken);
    expect(userAll).toStrictEqual({
      users: [
        {
          uId: 1000,
          email: 'abob@gmail.com',
          nameFirst: 'oob',
          nameLast: 'larley',
          handleStr: 'ooblarley',
          profileImgUrl: expect.any(String)
        },
        {
          uId: 1005,
          email: 'zhham12@gmail.com',
          nameFirst: 'zham',
          nameLast: 'bolek',
          handleStr: 'zhambolek',
          profileImgUrl: expect.any(String)
        },
        {
          uId: 1010,
          email: 'bhelloworld@gmail.com',
          nameFirst: 'light',
          nameLast: 'bulb',
          handleStr: 'lightbulb',
          profileImgUrl: expect.any(String)
        },
      ]
    });
  });

  test('Passing in Normal Parameters (ONE Account) | TEST 2:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    const userAll = userAllDetails(firstToken);
    expect(userAll).toStrictEqual({
      users: [
        {
          uId: 1000,
          email: 'abob@gmail.com',
          nameFirst: 'oob',
          nameLast: 'larley',
          handleStr: 'ooblarley',
          profileImgUrl: expect.any(String)
        }
      ]
    });
  });

  test('Passing in an Invalid Token | TEST 3:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const userAll = userAllDetails('-32kjkBY7SHNSD7SXssa');
    expect(userAll).toStrictEqual(403);
  });

  test('Passing in an Empty String | TEST 4:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userAll = userAllDetails('');
    expect(userAll).toStrictEqual(403);
  });
});

// Tests for userSetNameV1
describe('Testing \'userSetNameV2\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts) | TEST 1:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    const userNameChange = userSetName(secondToken, 'Bobby', 'Diaz');
    expect(userNameChange).toStrictEqual({});
  });

  test('Passing in NOT Normal Parameters (nameFirst longer than 50 characters) | TEST 2:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userNameChange = userSetName(secondToken, 'g271ge6gsg2167gs217g6gsb172gs21bgs21gs21gs127g87gs8', 'Ragnarson');
    expect(userNameChange).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (nameLast longer than 50 characters) | TEST 3:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userNameChange = userSetName(secondToken, 'Joey', 'g271ge6gsg2167gs217g6gsb172gs21bgs21gs21gs127g87gs8');
    expect(userNameChange).toStrictEqual(400);
  });

  test('Passing in an EMPTY String | TEST 4:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userNameChange = userSetName(secondToken, 'Joey', '');
    expect(userNameChange).toStrictEqual(400);
  });

  test('Passing in an Invalid Token | TEST 5:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userNameChange = userSetName('-32kjkBY7SHNSD7SXssa', 'Joey', 'Diaz');
    expect(userNameChange).toStrictEqual(403);
  });

  test('Passing in Normal Parameters (Member & channel owner) | TEST 6:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);

    const userNameChange = userSetName(secondToken, 'Bobby', 'Diaz');
    expect(userNameChange).toStrictEqual({});
  });
});

// Tests for userSetEmailV1
describe('Testing \'userSetEmailV2\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts) | TEST 1:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    const userEmailChange = userSetEmail(secondToken, 'joey6921@gmail.com');
    expect(userEmailChange).toStrictEqual({});
  });

  test('Passing in NOT Normal Parameters (email is not valid) | TEST 2:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userEmailChange = userSetEmail(secondToken, 'pbobgmail.com');
    expect(userEmailChange).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (email is in use) | TEST 3:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userEmailChange = userSetEmail(secondToken, 'abob@gmail.com');
    expect(userEmailChange).toStrictEqual(400);
  });

  test('Passing in an Empty String | TEST 4:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userEmailChange = userSetEmail(secondToken, '');
    expect(userEmailChange).toStrictEqual(400);
  });

  test('Passing in an Invalid Token | TEST 5:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userEmailChange = userSetEmail('-32kjkBY7SHNSD7SXssa', 'joey6921@gmail.com');
    expect(userEmailChange).toStrictEqual(403);
  });

  test('Passing in Normal Parameters (Channel member and owner) | TEST 6:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);

    const userEmailChange = userSetEmail(secondToken, 'joey6921@gmail.com');
    expect(userEmailChange).toStrictEqual({});
  });
});

// Tests for userSetHandleV1
describe('Testing \'userSetHandleV2\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts) | TEST 1:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    const userHandleChange = userSetHandle(secondToken, 'viking69');
    expect(userHandleChange).toStrictEqual({});
  });

  test('Passing in NOT Normal Parameters (Handle is not between 3 & 20 characters) | TEST 2:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userHandleChange = userSetHandle(secondToken, 'vikingE38HDS8DHDHh34hdjsu8s3d69');
    expect(userHandleChange).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (Handle contains non alphanumeric characters) | TEST 3:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userHandleChange = userSetHandle(secondToken, 'hel?en#');
    expect(userHandleChange).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (Handle in USE) | TEST 4:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userHandleChange = userSetHandle(secondToken, 'ooblarley');
    expect(userHandleChange).toStrictEqual(400);
  });

  test('Passing in an Invalid Token | TEST 5:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const userHandleChange = userSetHandle('-32kjkBY7SHNSD7SXssa', 'joeybig21');
    expect(userHandleChange).toStrictEqual(403);
  });

  test('Passing in an Empty String | TEST 6:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const userHandleChange = userSetHandle(secondToken, '');
    expect(userHandleChange).toStrictEqual(400);
  });

  test('Passing in Normal Parameters (Owner of channel) | TEST 7:', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);

    const userHandleChange = userSetHandle(secondToken, 'viking69');
    expect(userHandleChange).toStrictEqual({});
  });
});

// test for first 2 user
describe('Testing \'userStatsV1\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts, One Channel) | TEST 1:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats(secondToken);
    expect(userStatsNow).toStrictEqual(expect.any(Object));
  });

  test('Passing in Normal Parameters (Is not member of DM) | TEST 2:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(thirdToken, [secondUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats(secondToken);
    expect(userStatsNow).toStrictEqual(expect.any(Object));
  });

  test('Passing in Normal Parameters (Is not channel member) | TEST 3:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(firstToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(firstToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(firstToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats(secondToken);
    expect(userStatsNow).toStrictEqual(expect.any(Object));
  });

  test('Passing in Normal Parameters (Not Part of channel or DM) | TEST 4:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats(secondToken);
    expect(userStatsNow).toStrictEqual(expect.any(Object));
  });

  test('Passing in NOT Normal Parameters (Invalid Token) | TEST 5:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats('-21fsadHIUSD78djd98ea');
    expect(userStatsNow).toStrictEqual(403);
  });

  test('Passing in Normal Parameters (Not a member of DM) | TEST 6:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const fourthUser = register('samie09@gmail.com', 'helloworld12123', 'Sam', 'Doie');
    const fourthToken = fourthUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const userStatsNow = userStats(fourthToken);
    expect(userStatsNow).toStrictEqual(expect.any(Object));
  });
});

describe('Testing \'usersStatsV1\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts, One Channel, One DM) | TEST 1:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const usersStatsAllResult = usersStatsAll(firstToken);
    expect(usersStatsAllResult).toStrictEqual(expect.any(Object));
  });

  test('Passing in NOT Normal Parameters (Invalid Token) | TEST 2:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const usersStatsAllResult = usersStatsAll('-sndsau9ABHJBha78');
    expect(usersStatsAllResult).toStrictEqual(403);
  });
});

describe('Testing \'adminUserRemoveV1\' Function:', () => {
  test('Passing in Normal Parameters (Multiple Accounts, One Channel, One DM) | TEST 1:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove(firstToken, 1010);
    expect(adminUserRemoveNow).toStrictEqual({});
  });

  test('Passing in NOT Normal Parameters (uId invalid) | TEST 2:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove(firstToken, -10762);
    expect(adminUserRemoveNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (ONLY global owner) | TEST 3:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove(firstToken, 1000);
    expect(adminUserRemoveNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (authorised user is NOT a global owner) | TEST 4:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove(thirdToken, 1005);
    expect(adminUserRemoveNow).toStrictEqual(403);
  });

  test('Passing in NOT Normal Parameters (Invalid Token) | TEST 5:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove('-sdjs839hjdj23nadsfniaBSHS97', 1005);
    expect(adminUserRemoveNow).toStrictEqual(403);
  });

  test('Passing in Normal Parameters (Channel Owner being Removed) | TEST 6:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserRemoveNow = adminUserRemove(firstToken, 1005);
    expect(adminUserRemoveNow).toStrictEqual({});
  });
});

describe('Testing \'adminUserPermissionChangeV1\' Function:', () => {
  test('Passing in Normal Parameters (Promotion to Owner) | TEST 1:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, secondUser.authUserId, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual({});
  });

  test('Passing in Normal Parameters (Demotion to Member) | TEST 2:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    // All 3 are now global owners
    adminUserPermissionChange(firstToken, secondUser.authUserId, 1);

    adminUserPermissionChange(firstToken, thirdUser.authUserId, 1);

    // DEMOTE SECOND USER TO MEMBER
    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, secondUser.authUserId, 2);
    expect(adminUserPermissionChangeNow).toStrictEqual({});
  });

  test('Passing in NOT Normal Parameters (Invalid uId) | TEST 3:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, -82931, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (ONLY Global Owner --> being demoted) | TEST 4:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, 1000, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (Invalid permissionId) | TEST 5:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, -82931, -6);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (User Already has ownership permission) | TEST 6:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, 1000, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (User Already has member permission) | TEST 7:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, 1005, 2);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });

  test('Passing in NOT Normal Parameters (Authorised User is NOT a Global Owner) | TEST 8:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(thirdToken, 1005, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual(403);
  });

  test('Passing in NOT Normal Parameters (Invalid Token) | TEST 9:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange('-BS8GAShbx8asbsa89', secondUser.authUserId, 1);
    expect(adminUserPermissionChangeNow).toStrictEqual(403);
  });

  test('Passing in NOT Normal Parameters (Invalid Token) | TEST 10:', () => {
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channel = channelCreate(secondToken, 'channel1', true);
    join(thirdToken, channel.channelId);
    sendChannelMsg(thirdToken, channel.channelId, 'Hello guys');
    sendChannelMsg(secondToken, channel.channelId, 'Hey bro what is up?');
    sendChannelMsg(thirdToken, channel.channelId, 'Not much how about yourself?');
    sendChannelMsg(secondToken, channel.channelId, 'uhhhhh');

    const dm = dmCreate(secondToken, [firstUser.authUserId, thirdUser.authUserId]);
    sendDm(firstToken, dm.dmId, 'Hey Guys!!');
    sendDm(secondToken, dm.dmId, 'Hey Bro whats up');
    sendDm(thirdToken, dm.dmId, 'YOO GUYS');
    sendDm(firstToken, dm.dmId, 'Nothing much what about yus');
    sendDm(thirdToken, dm.dmId, 'kickin back');

    const adminUserPermissionChangeNow = adminUserPermissionChange(firstToken, secondUser.authUserId, -4);
    expect(adminUserPermissionChangeNow).toStrictEqual(400);
  });
});

describe('Testing ERROR cases for User Profile Photo', () => {
  test('Invalid Token', async () => {
    register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto('slda', 'http://www.traveller.com.au/content/dam/images/h/1/p/q/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724.jpg', 30, 40, 50, 60);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(403);
  });
  test('imgurl returns not a 200', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'djsaldjlldajskld', 30, 40, 50, 60);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(400);
  });
  test('img uploaded is not a jpg', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'http://www.traveda/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724', 30, 40, 50, 60);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(400);
  });
  test('any of dimensions arent on the photo', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'http://www.traveller.com.au/content/dam/images/h/1/p/q/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724.jpg', 1000, 2000, 30000, 100000);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(400);
  });
  test('xend is less than xstart and ystart is bigger then yend', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'http://www.traveller.com.au/content/dam/images/h/1/p/q/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724.jpg', 100, 200, 10, 20);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(400);
  });
  test('xend is less than xstart and ystart is bigger then yend', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'http://www.traveller.com.au/content/dam/images/h/1/p/q/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724.jpg', 100, 200, 20000, 30000);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual(400);
  });
});

describe('Testing SUCCESS cases for User Profile Photo', () => {
  test('valid return', async () => {
    const user1 = register('bob@gmail.com', 'dljsadl213', 'dsajdl', 'djsaljdas');
    const uploadRet = uploadPhoto(user1.token, 'http://www.traveller.com.au/content/dam/images/h/1/p/q/1/k/image.related.articleLeadwide.620x349.h1pq27.png/1596176460724.jpg', 30, 40, 50, 60);
    await new Promise((r) => setTimeout(r, 4000));
    expect(uploadRet).toStrictEqual({});
  });
});
