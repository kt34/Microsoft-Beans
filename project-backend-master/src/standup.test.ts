// Importing in the different functions needed for testing.
import request from 'sync-request';
import config from './config.json';

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
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const channel = JSON.parse(res.body as string);
  return channel;
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

const start = (token, channelId, length) => {
  const res = request(
    'POST',
    `${url}:${port}/standup/start/v1`,
    {
      json: {
        channelId: channelId,
        length: length,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const standUp = JSON.parse(res.body as string);
  return standUp;
};

const send = (token, channelId, message) => {
  const res = request(
    'POST',
    `${url}:${port}/standup/send/v1`,
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
  const messages = JSON.parse(res.body as string);
  return messages;
};

const active = (token, channelId) => {
  const res = request(
    'GET',
    `${url}:${port}/standup/active/v1`,
    {
      qs: {
        channelId: channelId,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const standUpActive = JSON.parse(res.body as string);
  return standUpActive;
};

beforeEach(() => {
  clear();
});

jest.setTimeout(60000);
jest.useRealTimers();

// Tests used to test the standupStartV1 function.
describe('HTTP tests for standupStartV1 using jest', () => {
  test('channelId does not exist', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    create(registerToken1, 'happy', true);

    // Tries to start a standup in non-existant channel. Error.
    const startupResult = start(registerToken1, 1, 5);
    expect(startupResult).toBe(400);
  });

  test('token is invalid', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Tries to start a standup using invalid token. Error.
    const startupResult = start('-A+b/|?123', channelId1, 5);
    expect(startupResult).toBe(403);
  });

  test('length is negative', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Tries to start a standup using negative time length. Error.
    const startupResult = start(registerToken1, channelId1, -5);
    expect(startupResult).toBe(400);
  });

  test('standup is already active in channel', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Starts a standup.
    let startupResult = start(registerToken1, channelId1, 5);
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    startupResult = start(registerToken1, channelId1, 5);
    expect(startupResult).toBe(400);
    await new Promise((r) => setTimeout(r, 7000));
  });

  test('Authorised user not a part of channel', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token.
    const userRegister2 = register('dog@gmail.com', 'passwordass', 'happy', 'bird');
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // 2nd registered tries starting standup in channel hes not a part of. Error.
    const startupResult = start(registerToken2, channelId1, 5);
    expect(startupResult).toBe(403);
  });

  test('standup is successful | TEST1', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('dog@gmail.com', 'passwordass', 'happy', 'bird');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // invite user to channel.
    invite(registerToken1, channelId1, registerAuthId2);

    // Owner of server starts standup in channel.
    const startupResult = start(registerToken1, channelId1, 5);
    send(registerToken1, channelId1, 'hello');
    send(registerToken1, channelId1, 'how are you?');
    send(registerToken2, channelId1, 'good thanks');
    await new Promise((r) => setTimeout(r, 7000));
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    send(registerToken1, channelId1, 'wait');
    send(registerToken2, channelId1, 'no');
    const messages = message(registerToken1, channelId1, 0);
    const expected = {
      messages: [
        {
          messageId: expect.any(Number),
          uId: registerAuthId1,
          message: 'duckman: hello\nduckman: how are you?\nhappybird: good thanks',
          timeSent: expect.any(Number),
          reacts: [
            {
              reactId: 1,
              uIds: [],
              isThisUserReacted: false,
            }
          ],
          isPinned: false,
        }
      ],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('standup is successful but no messages sent | TEST2', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Owner of server starts standup in channel.
    const startupResult = start(registerToken1, channelId1, 5);
    await new Promise((r) => setTimeout(r, 7000));
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    send(registerToken1, channelId1, 'wait');
    send(registerToken1, channelId1, 'no');
    const messages = message(registerToken1, channelId1, 0);
    const expected = {
      messages: [],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });
});

// Tests used to test the standupActiveV1 function.
describe('HTTP tests for standupActiveV1 using jest', () => {
  test('channelId does not exist', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    create(registerToken1, 'happy', false);

    // Tries to start a standup in non-existant channel. Error.
    const startupResult = active(registerToken1, 1);
    expect(startupResult).toBe(400);
  });

  test('token is invalid', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Tries to check activation of a standup using invalid token. Error.
    const startupResult = active('-A+b/|?123', channelId1);
    expect(startupResult).toBe(403);
  });

  test('Authorised user not a part of channel', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token.
    const userRegister2 = register('dog@gmail.com', 'passwordass', 'happy', 'bird');
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // 2nd registered tries checking activation of standup in channel hes not a part of. Error.
    const startupResult = active(registerToken2, channelId1);
    expect(startupResult).toBe(403);
  });

  test('standup activation is successful and active', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Owner of server starts standup in channel.
    start(registerToken1, channelId1, 5);
    const startupActivationResult = active(registerToken1, channelId1);
    const expected = {
      isActive: true,
      timeFinish: expect.any(Number),
    };
    expect(startupActivationResult).toStrictEqual(expected);
    await new Promise((r) => setTimeout(r, 7000));
  });

  test('standup activation is successful and not active | TEST2', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Owner of server starts standup in channel.
    start(registerToken1, channelId1, 5);
    await new Promise((r) => setTimeout(r, 7000));
    const startupActivationResult = active(registerToken1, channelId1);
    const expected = {
      isActive: false,
      timeFinish: null,
    };
    expect(startupActivationResult).toStrictEqual(expected);
  });
});

// Tests used to test the standupSendV1 function.
describe('HTTP tests for standupSendV1 using jest', () => {
  test('channelId does not exist', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    create(registerToken1, 'happy', false);

    // Tries to send a message to a standup in non-existant channel. Error.
    const startupResult = send(registerToken1, 1, 'hello');
    expect(startupResult).toBe(400);
  });

  test('token is invalid', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Starts a standup.
    let startupResult = start(registerToken1, channelId1, 5);
    // sends a message to a standup using invalid token. Error.
    startupResult = send('-A+b/|?123', channelId1, 'hello');
    expect(startupResult).toBe(403);
    await new Promise((r) => setTimeout(r, 7000));
  });

  test('length of message over 1000 characters', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Starts a standup.
    let startupResult = start(registerToken1, channelId1, 5);
    // sends a message to a standup using too long of message. Error.
    startupResult = send(registerToken1, channelId1, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(startupResult).toBe(400);
    await new Promise((r) => setTimeout(r, 7000));
  });

  test('standup is not active in channel', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;
    // sends a message to a none active standup. Error.
    const startupResult = send(registerToken1, channelId1, 'hello');
    expect(startupResult).toBe(400);
  });

  test('Authorised user not a part of channel', async () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token.
    const userRegister2 = register('dog@gmail.com', 'passwordass', 'happy', 'bird');
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Starts a standup.
    let startupResult = start(registerToken1, channelId1, 5);
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    // 2nd registered tries starting send message to an active standup in channel hes not a part of. Error.
    startupResult = send(registerToken2, channelId1, 'hello');
    expect(startupResult).toBe(403);
    await new Promise((r) => setTimeout(r, 7000));
  });

  test('standup send is successful | TEST1', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('dog@gmail.com', 'passwordass', 'happy', 'bird');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // invite user to channel.
    invite(registerToken1, channelId1, registerAuthId2);

    // Owner of server starts standup in channel.
    const startupResult = start(registerToken1, channelId1, 5);
    let sendResult = send(registerToken2, channelId1, 'hello');
    expect(sendResult).toStrictEqual({});
    sendResult = send(registerToken2, channelId1, 'how are you?');
    expect(sendResult).toStrictEqual({});
    sendResult = send(registerToken2, channelId1, 'good thanks');
    expect(sendResult).toStrictEqual({});
    await new Promise((r) => setTimeout(r, 7000));
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    sendResult = send(registerToken1, channelId1, 'wait');
    expect(sendResult).toBe(400);
    sendResult = send(registerToken2, channelId1, 'no');
    expect(sendResult).toBe(400);
    const messages = message(registerToken1, channelId1, 0);
    const expected = {
      messages: [
        {
          messageId: expect.any(Number),
          uId: registerAuthId1,
          message: 'happybird: hello\nhappybird: how are you?\nhappybird: good thanks',
          timeSent: expect.any(Number),
          reacts: [
            {
              reactId: 1,
              uIds: [],
              isThisUserReacted: false,
            }
          ],
          isPinned: false,
        }
      ],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('standup is successful but no messages sent | TEST2', async () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Owner of server starts standup in channel.
    const startupResult = start(registerToken1, channelId1, 5);
    await new Promise((r) => setTimeout(r, 7000));
    expect(startupResult).toStrictEqual({ timeFinish: expect.any(Number) });
    let sendResult = send(registerToken1, channelId1, 'wait');
    expect(sendResult).toBe(400);
    sendResult = send(registerToken1, channelId1, 'no');
    expect(sendResult).toBe(400);
    const messages = message(registerToken1, channelId1, 0);
    const expected = {
      messages: [],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });
});
