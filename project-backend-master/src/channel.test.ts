
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
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const userRegister = JSON.parse(res.body as string);
  return userRegister;
};
const create = (token, name, isPublic) => {
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
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const channel = JSON.parse(res.body as string);
  return channel;
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
        token: token,
      }
    }
  );

  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  const channelJoin = JSON.parse(res.body as string);
  return channelJoin;
};
const detail = (token, channelId) => {
  const res = request(
    'GET',
    `${url}:${port}/channel/details/v3`,
    {
      qs: {
        channelId: channelId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const newChannelDetails = JSON.parse(res.body as string);
  return newChannelDetails;
};
const add = (token, channelId, uId) => {
  const res = request(
    'POST',
    `${url}:${port}/channel/addowner/v2`,
    {
      json: {
        channelId: channelId,
        uId: uId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const channelAddOwner = JSON.parse(res.body as string);
  return channelAddOwner;
};
const remove = (token, channelId, uId) => {
  const res = request(
    'POST',
    `${url}:${port}/channel/removeowner/v2`,
    {
      json: {
        channelId: channelId,
        uId: uId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const channelRemoveOwner = JSON.parse(res.body as string);
  return channelRemoveOwner;
};
const send = (token, channelId, message) => {
  const res = request(
    'POST',
    `${url}:${port}/message/send/v2`,
    {
      json: {
        channelId: channelId,
        message: message,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const messageSent = JSON.parse(res.body as string);
  return messageSent;
};
const message = (token, channelId, start) => {
  const res = request(
    'GET',
    `${url}:${port}/channel/messages/v3`,
    {
      qs: {
        channelId: channelId,
        start: start,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const messages = JSON.parse(res.body as string);
  return messages;
};
const leave = (token, channelId) => {
  const res = request(
    'POST',
    `${url}:${port}/channel/leave/v2`,
    {
      json: {
        channelId: channelId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const channelLeaveOwner = JSON.parse(res.getBody() as string);
  return channelLeaveOwner;
};
const invite = (token, channelId, uId) => {
  const res = request(
    'POST',
    `${url}:${port}/channel/invite/v3`,
    {
      json: {
        channelId: channelId,
        uId: uId,
      },
      headers: {
        token: token,
      }
    }
  );

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const channelInviteResult = JSON.parse(res.body as string);
  return channelInviteResult;
};
const react = (token: string, messageId: number, reactId: number) => {
  const res = request(
    'POST',
    `${url}:${port}/message/react/v1`,
    {
      headers: {
        token: token,
      },
      json: {
        messageId: messageId,
        reactId: reactId,
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const messageReact = JSON.parse(res.body as string);
  return messageReact;
};
const toFindDuplicates = (array) => array.filter((item, index) => array.indexOf(item) !== index);

function messageArrayCreator(number, message, messageId, uId, start) {
  const messages = [];
  for (let i = start; i < number; i++) {
    messages.push({ messageId: messageId[i], uId: uId, message: message[i], timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false });
  }
  return messages;
}

beforeEach(() => {
  clear();
});

describe('channelAddOwnerV2 tests', () => {
  test('test correct user | TEST 1', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);

    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {

          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',

        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',

        },
      ]
    });
  });

  test('test correct multiple users | TEST 2', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;
    const token3 = user3.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    join(token2, channel.channelId);
    add(token1, channel.channelId, user2.authUserId);
    join(token3, channel.channelId);
    add(token2, channel.channelId, user3.authUserId);

    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',
        },
        {
          uId: 1010,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobo@gmail.com',
          handleStr: 'bobmarley1',
        },
        {
          uId: 1015,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobi@gmail.com',
          handleStr: 'bobmarley2',
        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',
        },
        {
          uId: 1010,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobo@gmail.com',
          handleStr: 'bobmarley1',
        },
        {
          uId: 1015,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobi@gmail.com',
          handleStr: 'bobmarley2',
        },
      ],
    });
  });
  test('test invalid channelId | TEST 3', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);

    expect(add(token0, 1234, user1.authUserId)).toStrictEqual(400);
  });
  test('test invalid uId | TEST 4', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);

    expect(add(token0, channel.channelId, 1234)).toStrictEqual(400);
  });
  test('test uId not a member of channel | TEST 5', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;

    const channel = create(token0, 'test', true);

    expect(add(token0, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });
  test('test uId is already an owner of channel | TEST 6', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);

    expect(add(token0, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });
  test('test user does not have owner permission | TEST 7', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    join(token2, channel.channelId);

    expect(add(token1, channel.channelId, user2.authUserId)).toStrictEqual(403);
  });
  test('test token is invalid | TEST 8', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);

    expect(add('blahblah123', channel.channelId, user1.authUserId)).toStrictEqual(403);
  });
});
describe('channelDetailsV3 tests', () => {
  test('testing with one member inside', () => {
    const user1 = register('abob@gmail.com', 'hello123', 'Bob', 'Larley');
    create(user1.token, 'channel1', true);
    expect(detail(user1.token, -1000)).toStrictEqual({
      name: 'channel1',
      isPublic: true,
      ownerMembers: [
        {

          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abob@gmail.com',
          handleStr: 'boblarley',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abob@gmail.com',
          handleStr: 'boblarley',
        },
      ],
    });
  });

  test('testing with multiple members', () => {
    const user0 = register('abob@gmail.com', 'hello123', 'Bob', 'Larley');
    const user1 = register('abobe@gmail.com', 'hello123', 'Bob', 'Larley');
    const user2 = register('abobn@gmail.com', 'hello123', 'Bob', 'Larley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;

    create(token0, 'channel1', true);
    join(token1, -1000);
    join(token2, -1000);
    expect(detail(token0, -1000)).toStrictEqual({
      name: 'channel1',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abob@gmail.com',
          handleStr: 'boblarley',
        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abob@gmail.com',
          handleStr: 'boblarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abobe@gmail.com',
          handleStr: 'boblarley0',
        },
        {
          uId: 1010,
          nameFirst: 'bob',
          nameLast: 'larley',
          email: 'abobn@gmail.com',
          handleStr: 'boblarley1',
        },
      ],
    });
  });

  test('channel id does not refer to a valid channel', () => {
    const user = register('abob@gmail.com', 'hello123', 'Bob', 'Larley');
    create(user.token, 'channel1', true);

    expect(detail(user.token, -2003)).toStrictEqual(400);
  });

  test('token is invalid', () => {
    const user = register('abob@gmail.com', 'hello123', 'Bob', 'Larley');
    create(user.token, 'channel1', true);
    expect(detail('blahblah', -1000)).toStrictEqual(403);
  });

  test('channelid is valid and the autherised user is not a member of the channel', () => {
    const user0 = register('abob@gmail.com', 'hello123', 'Bob', 'Larley');
    const user1 = register('aboeb@gmail.com', 'hello123', 'Bobe', 'Larley1');
    const token = user0.token;
    const token0 = user1.token;
    create(token, 'channel1', true);
    expect(detail(token0, -1000)).toStrictEqual(403);
  });
});
describe('channelRemoveOwnerV2 tests', () => {
  test('test remove owner | TEST 1', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    remove(token0, channel.channelId, user1.authUserId);
    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',
        },
      ]
    });
  });

  test('test remove multiple owners | TEST 2', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;
    const token3 = user3.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    join(token2, channel.channelId);
    add(token1, channel.channelId, user2.authUserId);
    join(token3, channel.channelId);
    add(token2, channel.channelId, user3.authUserId);
    remove(token0, channel.channelId, user1.authUserId);
    remove(token0, channel.channelId, user3.authUserId);

    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',

        },
        {
          uId: 1010,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobo@gmail.com',
          handleStr: 'bobmarley1',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
        {
          uId: 1005,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bob@gmail.com',
          handleStr: 'bobmarley0',
        },
        {
          uId: 1010,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobo@gmail.com',
          handleStr: 'bobmarley1',

        },
        {
          uId: 1015,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'bobi@gmail.com',
          handleStr: 'bobmarley2',

        },
      ],
    });
  });
  test('test invalid channelId | TEST 3', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);

    expect(remove(token0, 1234, user1.authUserId)).toStrictEqual(400);
  });
  test('test invalid uId | TEST 4', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);

    expect(remove(token0, channel.channelId, 1234)).toStrictEqual(400);
  });
  test('test uId not an owner of channel | TEST 5', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);

    expect(remove(token0, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });
  test('test uId is the only owner of channel | TEST 6', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token1, 'test', true);

    expect(remove(token0, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });
  test('test user does not have owner permission | TEST 7', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    join(token2, channel.channelId);

    add(token0, channel.channelId, user1.authUserId);

    expect(remove(token2, channel.channelId, user1.authUserId)).toStrictEqual(403);
  });
  test('test token is invalid | TEST 8', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    expect(remove('blahblah123', channel.channelId, user1.authUserId)).toStrictEqual(403);
  });
});
describe('channelLeaveV2 tests', () => {
  test('test correct user | TEST 1', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    leave(token1, channel.channelId);

    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
      ],
    });
  });
  test('test multiple users | TEST 2', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;
    const token2 = user2.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    join(token2, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    leave(token1, channel.channelId);
    leave(token2, channel.channelId);

    expect(detail(token0, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',

        },
      ],
      allMembers: [
        {
          uId: 1000,
          nameFirst: 'bob',
          nameLast: 'marley',
          email: 'hello@gmail.com',
          handleStr: 'bobmarley',
        },
      ],
    });
  });
  test('test only owner left | TEST 3', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);
    join(token1, channel.channelId);
    add(token0, channel.channelId, user1.authUserId);
    leave(token0, channel.channelId);

    expect(detail(token0, channel.channelId)).toStrictEqual(403);
  });
  test('test invalid channelId | TEST 4', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;

    create(token0, 'test', true);

    expect(leave(token0, 1234)).toStrictEqual(400);
  });
  test('test user is not a member | TEST 5', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('hellio@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;
    const token1 = user1.token;

    const channel = create(token0, 'test', true);

    expect(leave(token1, channel.channelId)).toStrictEqual(403);
  });
  test('test invalid token | TEST 6', () => {
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token0 = user0.token;

    const channel = create(token0, 'test', true);

    expect(leave('blahblah123', channel.channelId)).toStrictEqual(400);
  });
});
describe('Testing \'channelJoinV3\' Function', () => {
  test('Passing in NORMAL Parameters (Multiple Users) | TEST 1', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    // Creates a channel and obtains its channelId
    const channelCreate1 = create(thirdToken, 'channel1', true);
    const channelId1 = channelCreate1.channelId;
    const joinChannel = join(secondToken, channelId1);

    expect(joinChannel).toStrictEqual({});
  });

  test('Passing in NORMAL Parameters (Private Channel & Global Owner ) | TEST 2', () => {
    // Global owner registration
    const firstUser = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const firstToken = firstUser.token;
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    // Registers third user and obtains their uId
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channelCreate1 = create(thirdToken, 'channel1', false);
    const channelId1 = channelCreate1.channelId;

    const joinChannel = join(firstToken, channelId1);

    expect(joinChannel).toStrictEqual({});
  });

  test('Passing in Parameters (Invalid channelId) | TEST 3', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    create(thirdToken, 'channel1', true);

    const joinChannel = join(secondToken, 1986);

    expect(joinChannel).toStrictEqual(400);
  });

  test('Passing in Parameters (Already a Member) | TEST 4', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    // Registers third user and obtains their uId
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channelCreate1 = create(thirdToken, 'channel1', true);
    const channelId1 = channelCreate1.channelId;

    const joinChannel = join(thirdToken, channelId1);

    expect(joinChannel).toStrictEqual(400);
  });

  test('Passing in Parameters (Private Channel & non-Global Owner) | TEST 5', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');

    // Registers second user and obtains their token.
    const secondUser = register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');
    const secondToken = secondUser.token;

    // Registers third user and obtains their uId
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channelCreate1 = create(thirdToken, 'channel1', false);
    const channelId1 = channelCreate1.channelId;

    const joinChannel = join(secondToken, channelId1);

    expect(joinChannel).toStrictEqual(403);
  });

  test('Passing in Parameters (Invalid Token) | TEST 6', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    // Registers third user and obtains their uId
    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channelCreate1 = create(thirdToken, 'channel1', false);
    const channelId1 = channelCreate1.channelId;

    const joinChannel = join('-0s8HIFAhu9d9ndsnk', channelId1);

    expect(joinChannel).toStrictEqual(403);
  });

  test('Passing in Parameters (Empty String) | TEST 7', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('zhham12@gmail.com', 'helloworld543', 'zham', 'bolek');

    const thirdUser = register('bhelloworld@gmail.com', 'helloworld123', 'LIGHT', 'BULB');
    const thirdToken = thirdUser.token;

    const channelCreate1 = create(thirdToken, 'channel1', false);
    const channelId1 = channelCreate1.channelId;

    const joinChannel = join('', channelId1);

    expect(joinChannel).toStrictEqual(403);
  });
});

// Tests used to test the channelMessagesV3 function.
describe('HTTP test for channelMessagesV3 using jest', () => {
  test('When the channelId is not valid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Checking the messages of a channel using an invalid channelId. Expect an error.
    const channelMessagesResult = message(registerToken1, 1, 0);
    expect(channelMessagesResult).toBe(400);
  });

  test('When the start greater than total number of messages in channel', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Using a start value greater than the number of messages there are. Expect an error.
    // Here there are 0 messages yet we are starting at second message, which doesn't exist.
    const channelMessagesResult = message(registerToken1, channelId1, 1);
    expect(channelMessagesResult).toBe(400);
  });

  test('ChannelId valid, however, authUserId representing the token and requesting messages from channel is not part of it', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their token.
    const userRegister2 = register('g@gmail.com', 'ldslidee', 'aacow', 'aameow');
    const registerToken2 = userRegister2.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Second registered user requests messages from the 'happy' server, but they are
    // not a member of it, yet it exists. Causing expected outcome to be an error.
    const channelMessagesResult = message(registerToken2, channelId1, 0);
    expect(channelMessagesResult).toBe(403);
  });

  test('Using an invalid token', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Trying to retreive messages using an invalid token. Expect an error.
    const channelMessagesResult = message('-A+b/|?123', channelId1, 0);
    expect(channelMessagesResult).toBe(403);
  });

  test('When start equals number of messages', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // There are 0 messages (since channel was just made) and we are starting at message 0
    // (first message), so we get an empty array and 'end' becomes -1.
    const channelMessagesResult = message(registerToken1, channelId1, 0);
    expect(channelMessagesResult).toStrictEqual({ messages: [], start: 0, end: -1 });
  });

  test('When start equals number of messages; test number 2', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Sends some messages into the channel.
    send(registerToken1, channelId1, 'hello');
    send(registerToken1, channelId1, 'hell');
    send(registerToken1, channelId1, 'hel');

    // There are 3 messages and we are starting at value 3, so we get
    // an empty array and 'end' becomes -1.
    const channelMessagesResult = message(registerToken1, channelId1, 3);
    expect(channelMessagesResult).toStrictEqual({ messages: [], start: 3, end: -1 });
  });

  test('When start is a negative value', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // There are 0 messages (since channel was just made) and we are starting at message -1,
    // which isn't possible, so we get an error as an outcome.
    const channelMessagesResult = message(registerToken1, channelId1, -1);
    expect(channelMessagesResult).toBe(400);
  });

  test('When there is less than 50 messages and start is less than number of messages', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    const messageIds = [];
    const messages = [];
    // loops used to add 49 messages to a channel.
    for (let i = 0; i < 49; i++) {
      const msgId = send(registerToken1, channelId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 49 messages.
    const channelMessagesResult = message(registerToken1, channelId1, 0);
    expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(49, messages, messageIds, registerAuthId1, 0), start: 0, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(49);
  });

  test('When there is less than 50 messages and start is less than number of messages; test number 2', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    const messageIds = [];
    const messages = [];
    // loops used to add 40 messages to a channel.
    for (let i = 0; i < 40; i++) {
      const msgId = send(registerToken1, channelId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 28 messages.
    const channelMessagesResult = message(registerToken1, channelId1, 12);
    expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(40, messages, messageIds, registerAuthId1, 12), start: 12, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(40);
  });

  test('When there is more than 50 messages and start is less than number of messages', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    const messageIds = [];
    const messages = [];
    // loops used to add 51 messages to a channel.
    for (let i = 0; i < 51; i++) {
      const msgId = send(registerToken1, channelId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    let loopNum = 0;
    let end = 0;
    let start = 0;

    // seeing if right outcomes happens when undergoing pagination.
    while (end !== -1) {
      const channelMessagesResult = message(registerToken1, channelId1, start);
      if (loopNum === 1) {
        expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(51, messages, messageIds, registerAuthId1, 50), start: 50, end: -1 });
        end = -1;
      } else {
        expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(50, messages, messageIds, registerAuthId1, 0), start: 0, end: 50 });
        start = start + 50;
      }
      loopNum++;
    }
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(51);
  });

  test('When there is more than 50 messages and start is less than number of messages; test number 2', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    const messageIds = [];
    const messages = [];
    // loops used to add 70 messages to a channel.
    for (let i = 0; i < 70; i++) {
      const msgId = send(registerToken1, channelId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    let loopNum = 0;
    let end = 0;
    let start = 10;

    // seeing if right outcomes happens when undergoing pagination.
    while (end !== -1) {
      const channelMessagesResult = message(registerToken1, channelId1, start);
      if (loopNum === 1) {
        expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(70, messages, messageIds, registerAuthId1, 60), start: 60, end: -1 });
        end = -1;
      } else {
        expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(60, messages, messageIds, registerAuthId1, start), start: 10, end: 60 });
        start = start + 50;
      }
      loopNum++;
    }
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(70);
  });

  test('When there is exactly 50 messages and start is less than number of messages', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    const messageIds = [];
    const messages = [];
    // loops used to add 50 messages to a channel.
    for (let i = 0; i < 50; i++) {
      const msgId = send(registerToken1, channelId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 50 messages.
    const channelMessagesResult = message(registerToken1, channelId1, 0);
    expect(channelMessagesResult).toStrictEqual({ messages: messageArrayCreator(50, messages, messageIds, registerAuthId1, 0), start: 0, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(50);
  });
  test('message react channelDms should return ', () => {
    // Creates one user and collects their token and uId.
    const user1 = register('mark@gmail.com', 'password', 'duck', 'man');
    register('mark@gmail.com', 'password', 'duck', 'man');
    register('mark@gmail.com', 'password', 'duck', 'man');

    const channel1 = create(user1.token, 'channel', true);
    const msg = send(user1.token, channel1.channelId, 'dksjdldads');
    react(user1.token, msg.messageId, 1);

    expect(message(user1.token, channel1.channelId, 0)).toStrictEqual({
      messages: [{
        messageId: msg.messageId,
        uId: user1.authUserId,
        message: 'dksjdldads',
        timeSent: expect.any(Number),
        reacts: [
          {
            reactId: 1,
            uIds: [1000],
            isThisUserReacted: true
          }
        ],
        isPinned: false,
      }],

      start: 0,

      end: -1
    }
    );
  });
});

describe('HTTP tests for channelInviteV3 using jest', () => {
  test('Inviting someone to a private channel with valid information used returns an empty object', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a private channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Invites second registered user to first registered user's channel.
    expect(invite(registerToken1, channelId1, registerAuthId2)).toStrictEqual({});
  });

  test('A member inviting someone to a channel they are in using valid information', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId and token.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates another user and collects their uId.
    const userRegister3 = register('g@gmail.com', 'ldslidee', 'aacow', 'aameow');
    const registerAuthId3 = userRegister3.authUserId;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // The owner of channel invites register 2, who is made a member, who then goes on to invite register 3.
    // The invite should be successful.
    expect(invite(registerToken1, channelId1, registerAuthId2)).toStrictEqual({});
    expect(invite(registerToken2, channelId1, registerAuthId3)).toStrictEqual({});
  });

  test('An owner inviting someone to a channel they are in using valid information', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a private channel using the token of the first person who registered, becoming the owner of it.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Owner of channel (first registered user) invites second registered user to his channel.
    expect(invite(registerToken1, channelId1, registerAuthId2)).toStrictEqual({});
  });

  test('Inviting someone to a public channel with valid information used', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Invites second registered user to first registered user's channel.
    expect(invite(registerToken1, channelId1, registerAuthId2)).toStrictEqual({});
  });

  test('Inviting someone using an invalid userID representing user being invited', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Inviting using an invalid uId. Expect an error.
    expect(invite(registerToken1, channelId1, -1)).toBe(400);
  });

  test('Inviting someone using an invalid token representing user doing the inviting', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Inviting using an invalid token. Expect an error.
    expect(invite('-A+b/|?123', channelId1, registerAuthId2)).toBe(403);
  });

  test('Inviting someone to channel using an invalid channelId', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Inviting using an invalid channelId. Expect an error.
    expect(invite(registerToken1, 1, registerAuthId2)).toBe(400);
  });

  test('Inviting someone who is already part of the channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates another user and collects their uId and token.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Invites second registered user to first registered user's channel.
    expect(invite(registerToken1, channelId1, registerAuthId2)).toStrictEqual({});

    // Now making second registered user invite the first registered user to his own server
    // that he is already a member in. Expect an error.
    expect(invite(registerToken2, channelId1, registerAuthId1)).toBe(400);
  });

  test('ChannelId valid, however, authUserId of the token inviting the uId to channel is not part of it', () => {
    // Creates one user and collects their uId and token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId and token.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerAuthId2 = userRegister2.authUserId;

    // Creates another user and collects their uId and token.
    const userRegister3 = register('g@gmail.com', 'ldslidee', 'aacow', 'aameow');
    const registerToken3 = userRegister3.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Third registered user invites second registered user to first registered user's channel, which
    // they are not a member in. Causing expected outcome to be an error.
    expect(invite(registerToken3, channelId1, registerAuthId2)).toBe(403);
  });
});
