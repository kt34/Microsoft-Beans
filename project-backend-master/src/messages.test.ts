// Importing in the different functions needed for testing.
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

const createdm = (token, uIds) => {
  const res = request(
    'POST',
    `${url}:${port}/dm/create/v2`,
    {
      json: {
        uIds: uIds,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const dm = JSON.parse(res.body as string);
  return dm;
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

const msg = (token, channelId, start) => {
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
  const message = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  return message;
};

const senddm = (token, dmId, message) => {
  const res = request(
    'POST',
    `${url}:${port}/message/senddm/v2`,
    {
      json: {
        dmId: dmId,
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

const edit = (token, messageId, message) => {
  const res = request(
    'PUT',
    `${url}:${port}/message/edit/v2`,
    {
      json: {
        messageId: messageId,
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
  const edit = JSON.parse(res.body as string);
  return edit;
};

const unpin = (token, messageId) => {
  const res = request(
    'POST',
    `${url}:${port}/message/unpin/v1`,
    {
      json: {
        messageId: messageId,
      },
      headers: {
        token: token,
      }
    }
  );

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const unpinned = JSON.parse(res.body as string);
  return unpinned;
};

const remove = (token, messageId) => {
  const res = request(
    'DELETE',
    `${url}:${port}/message/remove/v2`,
    {
      qs: {
        messageId: messageId,
      },
      headers: {
        token: token,
      }
    }
  );

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const msgRemove = JSON.parse(res.body as string);
  return msgRemove;
};

const pin = (token, messageId) => {
  const res = request(
    'POST',
    `${url}:${port}/message/pin/v1`,
    {
      json: {
        messageId: messageId,
      },
      headers: {
        token: token,
      }
    }
  );

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const pinned = JSON.parse(res.body as string);
  return pinned;
};

const msgDm = (token, dmId, start) => {
  const res = request(
    'GET',
    `${url}:${port}/dm/messages/v2`,
    {
      qs: {
        dmId: dmId,
        start: start,
      },
      headers: {
        token: token,
      }
    }
  );
  const messages = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  return messages;
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

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const channelJoin = JSON.parse(res.body as string);
  return channelJoin;
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

const unreact = (token: string, messageId: number, reactId: number) => {
  const res = request(
    'POST',
    `${url}:${port}/message/unreact/v1`,
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

const share = (token: string, ogMessageId: number, message: string, channelId: number, dmId: number) => {
  const res = request(
    'POST',
    `${url}:${port}/message/share/v1`,
    {
      headers: {
        token: token,
      },
      json: {
        ogMessageId: ogMessageId,
        message: message,
        channelId: channelId,
        dmId: dmId
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const messageShare = JSON.parse(res.body as string);
  return messageShare;
};

const search = (token, queryStr: string) => {
  const res = request(
    'GET',
    `${url}:${port}/search/v1`,
    {
      headers: {
        token: token
      },
      qs: {
        queryStr: queryStr
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const searching = JSON.parse(res.body as string);
  return searching;
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
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const newDmCreate = JSON.parse(res.body as string);
  return newDmCreate;
};
const notifications = (token) => {
  const res = request(
    'GET',
  `${url}:${port}/notifications/get/v1`,
  {
    headers: {
      token: token
    }
  }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const notification = JSON.parse(res.getBody() as string);
  return notification;
};
beforeEach(() => {
  clear();
});

// MESSAGE REACT
describe('MESSAGE REACT ERRORS', () => {
  test('tokenInvalid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react('djslds', message.messageId, 1)).toStrictEqual(403);
  });
  test('messageId is not a valid message within a channel or DM that the authorised uesr is part of', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, -1, 1)).toStrictEqual(400);
  });
  test('react id is not valid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, message.messageId, 2)).toStrictEqual(400);
  });
  test('the message already cntains a react with ID reactid from the authorised user', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    react(user2.token, message.messageId, 1);
    expect(react(user2.token, message.messageId, 1)).toStrictEqual(400);
  });
});

describe('MESSAGE REACT SUCCESS', () => {
  test('one user reacting to a message in a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple users reacting to a message in a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('bobde@gmail.com', 'djsdjlsa', 'user', 'four');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});
  });
  test('one user reacting to a message in a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple users reacting to a message in a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('sui@gmail.com', 'dlsjlda', 'user', '4');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple reacts in both channel and dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('sui@gmail.com', 'dlsjlda', 'user', 'four');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message1 = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});

    expect(react(user2.token, message1.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message1.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message1.messageId, 1)).toStrictEqual({});
  });
});

// MESSAGE UNREACT
describe('MESSAGE UNREACT ERRORS', () => {
  test('tokenInvalid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    react(user2.token, message.messageId, 1);
    expect(unreact('djslds', message.messageId, 1)).toStrictEqual(403);
  });
  test('messageId is not a valid message within a channel or DM that the authorised uesr is part of', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    react(user2.token, message.messageId, 1);
    expect(unreact(user2.token, -1, 1)).toStrictEqual(400);
  });
  test('react id is not valid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    react(user2.token, message.messageId, 1);
    expect(unreact(user2.token, message.messageId, 2)).toStrictEqual(400);
  });
  test('the message does not contain a react with ID reactId from the authorised user', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    react(user2.token, message.messageId, 1);
    expect(unreact(user3.token, message.messageId, 1)).toStrictEqual(400);
  });
});

describe('MESSAGE UNREACT SUCCESS', () => {
  test('one user unreacting to a message in a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user2.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple users unreacting to a message in a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('bobde@gmail.com', 'djsdjlsa', 'user', 'four');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});

    expect(unreact(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user4.token, message.messageId, 1)).toStrictEqual({});
  });
  test('one user unreacting to a message in a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user2.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple users unreacting to a message in a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('sui@gmail.com', 'dlsjlda', 'user', '4');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});

    expect(unreact(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user4.token, message.messageId, 1)).toStrictEqual({});
  });
  test('multiple reacts in both channel and dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('sui@gmail.com', 'dlsjlda', 'user', 'four');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message1 = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const message = send(user1.token, channel.channelId, 'heres a message');

    expect(react(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message.messageId, 1)).toStrictEqual({});

    expect(unreact(user2.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user3.token, message.messageId, 1)).toStrictEqual({});
    expect(unreact(user4.token, message.messageId, 1)).toStrictEqual({});

    expect(react(user2.token, message1.messageId, 1)).toStrictEqual({});
    expect(react(user3.token, message1.messageId, 1)).toStrictEqual({});
    expect(react(user4.token, message1.messageId, 1)).toStrictEqual({});

    expect(unreact(user2.token, message1.messageId, 1)).toStrictEqual({});
    expect(unreact(user3.token, message1.messageId, 1)).toStrictEqual({});
    expect(unreact(user4.token, message1.messageId, 1)).toStrictEqual({});
  });
});

// MESSAGE SHARE
describe('MESSAGE SHARE ERRORS', () => {
  test('tokenInvalid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share('djsl', message.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual(403);
  });

  test('both channelId and dmId are invalid', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added on', -1, -1)).toStrictEqual(400);
  });

  test('both channelId and dmId are invalid extra', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added on', -2, -3)).toStrictEqual(400);
  });

  test('neither channelId nor dmId are -1', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added on', 3, 4)).toStrictEqual(400);
  });

  test('ogMessageId does not refer to a valid message within a channel/dm that the authorised user has joined', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, -3, 'new message added on', channel.channelId, -1)).toStrictEqual(400);
  });

  test('length of optional message is more than 1000 characters', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added onnew message added onnew message added onnew' +
    'message added onnew message added onnew message added onnew message added onnew message added onnew message ' +
    'added onnew message added onnew message added onnew message added onnew message added onnew message added onnew ' +
    'message added onnew message added onnew message added onnew message added onnew message added onnew message added onne' +
    'message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew message ' +
    'added onnew message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew ' +
    'message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew ' +
    'message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew message added onnew ' +
    'message added onnew message added onnew message added onnew message added onnew message added on', channel.channelId, -1)).toStrictEqual(400);
  });

  test('the pair of channelId and dmId are valid and the authorised user has not joined the channel or dm they are trying to share the message to', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('bobds@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user4.token, message.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual(403);
  });
  test('invalid channel and dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');
    const user4 = register('bobds@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user4.token, message.messageId, 'new message added on', -1, -1)).toStrictEqual(400);
  });
});

describe('MESSAGE SHARE SUCCESS', () => {
  test('testing sharing from dm to a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual({ sharedMessageId: expect.any(Number) });
  });
  test('testing sharing multiple messages from dm to a channel', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'dsjalkdsajklsjlksa');
    const message1 = senddm(user1.token, dm.dmId, 'dsjalkddak');
    const message2 = senddm(user1.token, dm.dmId, 'dsjalkdklsjlksa');

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);

    expect(share(user1.token, message.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual({ sharedMessageId: expect.any(Number) });
    expect(share(user1.token, message1.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual({ sharedMessageId: expect.any(Number) });
    expect(share(user1.token, message2.messageId, 'new message added on', channel.channelId, -1)).toStrictEqual({ sharedMessageId: expect.any(Number) });
  });
  test('testing sharing from channel to a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);

    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);
    const message = send(user1.token, channel.channelId, 'djslka');

    expect(share(user1.token, message.messageId, 'new message added on', -1, dm.dmId)).toStrictEqual({ sharedMessageId: expect.any(Number) });
  });
  test('testing sharing multiple messages from channel to a dm', () => {
    const user1 = register('bob@gmail.com', 'djsdjlsa', 'user', 'one');
    const user2 = register('boba@gmail.com', 'djsdjlsa', 'user', 'two');
    const user3 = register('bobd@gmail.com', 'djsdjlsa', 'user', 'three');

    const dm = createdm(user1.token, [user2.authUserId, user3.authUserId]);
    const channel = create(user1.token, 'channel1', true);
    join(user2.token, channel.channelId);
    join(user3.token, channel.channelId);
    const message = send(user1.token, channel.channelId, 'djslka');
    const message1 = send(user1.token, channel.channelId, 'djslkadas');
    const message2 = send(user1.token, channel.channelId, 'djslkadsafga');

    expect(share(user1.token, message.messageId, 'new message added on', -1, dm.dmId)).toStrictEqual({ sharedMessageId: expect.any(Number) });
    expect(share(user1.token, message1.messageId, 'new message added on', -1, dm.dmId)).toStrictEqual({ sharedMessageId: expect.any(Number) });
    expect(share(user1.token, message2.messageId, 'new message added on', -1, dm.dmId)).toStrictEqual({ sharedMessageId: expect.any(Number) });
  });
});

describe('TEST CORRECT PARAMETERS search', () => {
  test('TEST 1 | searching a message at channel', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, 'hi')).toStrictEqual(expect.any(Object));
  });

  test('TEST 2 | searching a message at dm', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user1 = register('bofb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user2 = register('boffb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const dm1 = dmCreate(user.token, [user1.authUserId, user2.authUserId]);
    senddm(user.token, dm1.dmId, 'testing hi 123');
    senddm(user.token, dm1.dmId, 'djfbdjf 123');
    senddm(user.token, dm1.dmId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, 'hi')).toStrictEqual(expect.any(Object));
  });

  test('TEST 3 | searching a message at dm and channel', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user1 = register('bofb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user2 = register('boffb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const dm1 = dmCreate(user.token, [user1.authUserId, user2.authUserId]);
    senddm(user.token, dm1.dmId, 'testing hi 123');
    senddm(user.token, dm1.dmId, 'djfbdjf 123');
    senddm(user.token, dm1.dmId, 'tehfg hdbf hf hi 23');

    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, 'hi')).toStrictEqual(expect.any(Object));
  });
  test('TEST 4 | searching a message that does not exist in dm and channel', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user1 = register('bofb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const user2 = register('boffb@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const dm1 = dmCreate(user.token, [user1.authUserId, user2.authUserId]);
    senddm(user.token, dm1.dmId, 'testing hi 123');
    senddm(user.token, dm1.dmId, 'djfbdjf 123');
    senddm(user.token, dm1.dmId, 'tehfg hdbf hf hi 23');

    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, 'kevinLoveRay')).toStrictEqual({});
  });
});

describe('TEST INCORRECT PARAMETERS search', () => {
  test('TEST 1 |  queryStr less than 1', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, '')).toEqual(400);
  });
  test('TEST 2 |  queryStr bigger than 1000', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search(user.token, 'zH0vc0OYelSrLAqn2SAs3lzOemIXr6sF9T4XyMDZBcHFCQ7gZQ9jqgbIpIExq3LQVRm2D3lxeYCB3xPVK5cqM665wlBBc7elMjB0J5f4j8eQCtctPTaybMtAr1FJRAHuZluOIZ6y5mYc4HyKQoXjuP4Akkd2f4DPSX1ZzGzaEZpse0BgrlTSEXyqRDYlkWmMFRyJXzcq5nPA6ksQOBkLfIWGH3Snj3Cp2DkDsqb6NiZEOyqa3mCzdeoNHoUiAGBThyd3TLJh6Eu3rUGjOuHMhT8tGGXHR01ztj75RwZhqIcqmO7aiUDQANXbk2PvFA6Gstk8EeSYMVkP04aUxyRIvuL1YEb0TjtfliKNBdy5u0FDrK7V332b9bTBkHKUcwRdKkcD8hv4drJxR1CkJtTgi7QcPnq8R5qW1W1vi9HWEAmrNjCiyvnBenNxYGPLeBuKiqDE22ffbSgVGfRt56I5L7JwyYZtBAC0cyxh1gox97sYK3iOX96lYOpf00dHjQkjrYqb94Zw6y17LX6nmVvns65ElgmYQNQ3D55BNmZgCtdbE1O6N0t6UjACJzpPFaDZ7Q7VcDTSHLIC124gkLV9vTTDw3lSRoBRDFMddnjibuPKcGTDFD9gMCCpgWiq6XTaDJNDSGUhvwgRrKDgwGLyhZhhg9rGJM7Ozus3VTek6T9erPAniP2o4PFHS3N7q5L6UmavTItLQTWe4H90tnutFkdopdVKBeRL9jPRZHrE2IxZtu9dx9s6w2smXCrErUfpwUjndvsSSgQFyWLmBZ7SM9xkzDOaO8V0rRgBdVcyM0ZPxNP1s1JmCiW6rtoTRe22NrXTqUWn52HphM3JlqKBkmLgVfZklxK9cHXYXkiSkRjgRymev60ja0zYNKZdAPwIaGFeFYoCDc8MRhAHMLFkT6cjh5jRcIkAQockqwN1bT5Mp6lVl8Hnfhgw7BriAll2hdLrQmuaR7QbK3FzqtlQfrcZ4nl6fqilPfNXBdz93'
    )).toEqual(400);
  });
  test('TEST 3 | invalid token', () => {
    const user = register('bob@gmail.com', 'fuhudvhudvh', 'bob', 'marley');
    const channel = create(user.token, 'test', true);
    send(user.token, channel.channelId, 'testing hi 123');
    send(user.token, channel.channelId, 'djfbdjf 123');
    send(user.token, channel.channelId, 'tehfg hdbf hf hi 23');

    expect(search('hjdhhhfhfd', 'hi')).toEqual(403);
  });
});

// Tests used to test the messageSendV2 function.
describe('HTTP tests for messageSendV2 using jest', () => {
  test('channelId does not exist', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Trying to send message to a channelId that doesn't exist. Error.
    const channelMessageSendResult = send(registerToken1, 1, 'hello');
    expect(channelMessageSendResult).toBe(400);
  });

  test('token is invalid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Inputting an invalid token and getting an error for it.
    const channelMessageSendResult = send('-A+b/|?123', channelId1, 'hello');
    expect(channelMessageSendResult).toBe(403);
  });

  test('channelId valid but user of token is not a member of it', () => {
    // Creates one user and collects their uId and token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their token.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerToken2 = userRegister2.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // 2nd registered user tries sending message in first registered users channel,
    // however, is not apart of that channel. Returns error.
    const channelMessageSendResult = send(registerToken2, channelId1, 'hello');
    expect(channelMessageSendResult).toBe(403);
  });

  test('Given a message smaller than length 1', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Trying to send message that is too small. Error.
    const channelMessageSendResult = send(registerToken1, channelId1, '');
    expect(channelMessageSendResult).toBe(400);
  });

  test('Given a message equal to length 1', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Trying to send message of length one. Return messageId object.
    const channelMessageSendResult = send(registerToken1, channelId1, ' ');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Given a message equal to length 1000', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Trying to send message of length 1000. Return messageId object.
    const channelMessageSendResult = send(registerToken1, channelId1, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Given a message greater than length 1000', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a public channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // Trying to send message of length greater than 1000. Return Error.
    const channelMessageSendResult = send(registerToken1, channelId1, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(channelMessageSendResult).toBe(400);
  });

  test('Test successful case of one user sending messages to a channel', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // Inputting messages in channel from one user. Return messageIds.
    let channelMessageSendResult = send(registerToken1, channelId1, 'hello');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken1, channelId1, 'yayayayaya');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken1, channelId1, 'pingpong');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Test successful case of two users sending a message to a channel', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId and token.
    const userRegister2 = register('duck@gmail.com', 'passaaaword', 'dsdsuck', 'mffan');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', false);
    const channelId1 = channel1.channelId;

    // 1st registered user invites second registered user to their channel.
    invite(registerToken1, channelId1, registerAuthId2);

    // Inputting messages in channel from two users. Return messageIds.
    let channelMessageSendResult = send(registerToken1, channelId1, 'hello');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken1, channelId1, 'yayayayaya');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken1, channelId1, 'pingpong');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken2, channelId1, 'hello');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken2, channelId1, 'yayayayaya');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    channelMessageSendResult = send(registerToken2, channelId1, 'pingpong');
    expect(channelMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });
});

// Tests used to test the messageEditV2 function.
describe('HTTP tests for messageEditV2 using jest', () => {
  test('Given a message greater than length 1000', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    // Trying to edit a message to a length greater than 1000. Return Error.
    const editResult = edit(registerToken1, messageId, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(editResult).toBe(400);
  });

  test('tokenInvalid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    const editResult = edit('AssAS//SSsdfd+-', messageId, 'yayayayay');
    expect(editResult).toBe(403);
  });

  test('Message not belonging to user and user not being a global owner or DM owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('marke@gmail.com', 'passuword', 'duuck', 'manu');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    // not DM owner or own message so can't edit and return error.
    const editResult = edit(registerToken2, messageId, 'yayayayay');
    expect(editResult).toBe(403);
  });

  test('Message not belonging to user and user not being a global owner or channel owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their uId and token.
    const userRegister2 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken1, channelId1, registerAuthId2);

    // sending a message to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId = MessageSendResult.messageId;

    // not channel owner or own message or global owner (just a member) so can't edit and return error.
    const editResult = edit(registerToken2, messageId, 'yayayayay');
    expect(editResult).toBe(403);
  });

  test('Being a global owner and changing someone elses message in a channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the second person who registered.
    const channel1 = create(registerToken2, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken2, channelId1, registerAuthId1);

    // sending messages to channel.
    const MessageSendResult = send(registerToken2, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken2, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // global owner editing someone elses message.
    const editResult = edit(registerToken1, messageId2, 'yayayayay');
    expect(editResult).toStrictEqual({});

    // checking message edited.
    const messages = msg(registerToken1, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId2, uId: registerAuthId2, message: 'yayayayay', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('Being an owner and changing someone elses message in a channel', () => {
    // Creates one user and collects their token.
    register('mark@gmail.com', 'password', 'duck', 'man');

    // Creates one user and collects their uId and token.
    const userRegister2 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marsk@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a channel using the token of the 3rd person who registered.
    const channel1 = create(registerToken3, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken3, channelId1, registerAuthId2);

    // sending messages to channel.
    const MessageSendResult = send(registerToken2, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken2, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // channel owner editing someone elses message.
    const editResult = edit(registerToken3, messageId2, 'yayayayay');
    expect(editResult).toStrictEqual({});

    // checking message edited.
    const messages = msg(registerToken3, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId2, uId: registerAuthId2, message: 'yayayayay', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('Being an DM owner and changing someone elses message in a DM', () => {
    // Creates one user and collects their token.
    register('mark@gmail.com', 'password', 'duck', 'man');

    // Creates one user and collects their uId and token.
    const userRegister2 = register('meark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marsk@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 3rd person who registered.
    const dm1 = createdm(registerToken3, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    const MessageSendResult = senddm(registerToken2, dmId1, 'hello');
    const messageId = MessageSendResult.messageId;
    const MessageSendResult2 = senddm(registerToken2, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = senddm(registerToken2, dmId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // DM owner editing someone elses message.
    const editResult = edit(registerToken3, messageId2, 'yayayayay');
    expect(editResult).toStrictEqual({});

    // checking message edited.
    const messages = msgDm(registerToken3, dmId1, 0);

    const expected = {
      messages: [{ messageId: messageId, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId2, uId: registerAuthId2, message: 'yayayayay', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('MessageId not being within users channels and DMs', () => {
    // Creates one user and collects their token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('mama@gmail.com', 'passwordaaa', 'ducksa', 'masan');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 1st person who registered.
    createdm(registerToken2, []);

    // Creates a second DM using the token of the 2nd person who registered.
    const dm2 = createdm(registerToken3, []);
    const dmId2 = dm2.dmId;

    // sending a message to DM2.
    const MessageSendResult = senddm(registerToken3, dmId2, 'hello');
    const messageId = MessageSendResult.messageId;

    // DM owner of a different sever trying to edit someone elses message on a different DM, returning an error.
    const editResult = edit(registerToken2, messageId, 'yayayayay');
    expect(editResult).toBe(400);
  });
  test('successful edit in channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken1, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // channel owner editing their message.
    const editResult = edit(registerToken1, messageId2, 'yayayayay');
    expect(editResult).toStrictEqual({});

    // checking message edited.
    const messages = msg(registerToken1, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId1, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId2, uId: registerAuthId1, message: 'yayayayay', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId1, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('successful edit in DM', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    const MessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = MessageSendResult.messageId;
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = senddm(registerToken1, dmId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // DM owner editing their message.
    const editResult = edit(registerToken1, messageId2, 'yayayayay');
    expect(editResult).toStrictEqual({});

    // checking message edited.
    const messages = msgDm(registerToken1, dmId1, 0);

    const expected = {
      messages: [{ messageId: messageId, uId: registerAuthId1, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId2, uId: registerAuthId1, message: 'yayayayay', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId1, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('editing with an empty string', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken1, channelId1, 'boo');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken1, channelId1, 'goodbye');
    const messageId3 = MessageSendResult3.messageId;

    // editing 2nd message to be empty string.
    const editResult = edit(registerToken1, messageId2, '');
    expect(editResult).toStrictEqual({});

    const messages = msg(registerToken1, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId1, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId1, message: 'goodbye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });
});

describe('HTTP tests for messageRemoveV2 using jest', () => {
  test('tokenInvalid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;
    // invalid token.
    const removeResult = remove('AssAS//SSsdfd+-', messageId);
    expect(removeResult).toBe(403);
  });

  test('Message not belonging to user and user not being a global owner or DM owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    // not DM owner or own message so can't remove and return error.
    const removeResult = remove(registerToken2, messageId);
    expect(removeResult).toBe(403);
  });

  test('Message not belonging to user and user not being a global owner or channel owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken1, channelId1, registerAuthId2);

    // sending a message to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId = MessageSendResult.messageId;

    // not channel owner or own message or global owner (just a member) so can't delete and return error.
    const removeResult = remove(registerToken2, messageId);
    expect(removeResult).toBe(403);
  });

  test('Being a global owner and deleting someone elses message in a channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('marek@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a channel using the token of the second person who registered.
    const channel1 = create(registerToken2, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken2, channelId1, registerAuthId1);

    // sending messages to channel.
    const MessageSendResult = send(registerToken2, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken2, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // global owner deleting someone elses message.
    const removeResult = remove(registerToken1, messageId2);
    expect(removeResult).toStrictEqual({});

    // checking message removed.
    const messages = msg(registerToken1, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('Being an owner and deleting someone elses message in a channel', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a channel using the token of the 3rd person who registered.
    const channel1 = create(registerToken3, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken3, channelId1, registerAuthId2);

    // sending messages to channel.
    const MessageSendResult = send(registerToken2, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken2, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // channel owner deleting someone elses message.
    const removeResult = remove(registerToken3, messageId2);
    expect(removeResult).toStrictEqual({});

    // checking message removed.
    const messages = msg(registerToken3, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('Being an DM owner and deleting someone elses message in a DM', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 3rd person who registered.
    const dm1 = createdm(registerToken3, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    const MessageSendResult = senddm(registerToken2, dmId1, 'hello');
    const messageId = MessageSendResult.messageId;
    const MessageSendResult2 = senddm(registerToken2, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = senddm(registerToken2, dmId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // DM owner deleting someone elses message.
    const removeResult = remove(registerToken3, messageId2);
    expect(removeResult).toStrictEqual({});

    // checking message removed.
    const messages = msgDm(registerToken3, dmId1, 0);

    const expected = {
      messages: [{ messageId: messageId, uId: registerAuthId2, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId2, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('MessageId not being within users channels and DMs', () => {
    // Creates one user and collects their token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 1st person who registered.
    createdm(registerToken2, []);

    // Creates a second DM using the token of the 2nd person who registered.
    const dm2 = createdm(registerToken3, []);
    const dmId2 = dm2.dmId;

    // sending a message to DM2.
    const MessageSendResult = senddm(registerToken3, dmId2, 'hello');
    const messageId = MessageSendResult.messageId;

    // DM owner of a different sever trying to remove someone elses message on a different DM, returning an error.
    const removeResult = remove(registerToken2, messageId);
    expect(removeResult).toBe(400);
  });

  test('successful remove in channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId1 = MessageSendResult.messageId;
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = send(registerToken1, channelId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // channel owner deleting his message.
    const removeResult = remove(registerToken1, messageId2);
    expect(removeResult).toStrictEqual({});

    // checking message removed.
    const messages = msg(registerToken1, channelId1, 0);

    const expected = {
      messages: [{ messageId: messageId1, uId: registerAuthId1, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId1, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });

  test('successful remove in DM', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    const MessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = MessageSendResult.messageId;
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    const MessageSendResult3 = senddm(registerToken1, dmId1, 'bye');
    const messageId3 = MessageSendResult3.messageId;

    // DM owner deleting their message.
    const removeResult = remove(registerToken1, messageId2);
    expect(removeResult).toStrictEqual({});

    // checking message removed.
    const messages = msgDm(registerToken1, dmId1, 0);

    const expected = {
      messages: [{ messageId: messageId, uId: registerAuthId1, message: 'hello', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }, { messageId: messageId3, uId: registerAuthId1, message: 'bye', timeSent: expect.any(Number), reacts: [{ reactId: 1, uIds: [], isThisUserReacted: false }], isPinned: false }],
      start: 0,
      end: -1,
    };
    expect(messages).toStrictEqual(expected);
  });
});

describe('TEST CHANNEL PARAMETER', () => {
  test('TEST 1 | invalid token', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    expect(notifications('djncj')).toEqual(403);
  });
  test('TEST 2 | notification for adding to a channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1000,
        dmId: -1,
        notificationMessage: 'bobmarley added you to test'
      }]
    });
  });
  test('TEST 3 | notification for adding to multiple channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    const channel1 = create(user.token, 'test2', true);
    invite(user.token, channel.channelId, user1.authUserId);
    invite(user.token, channel1.channelId, user1.authUserId);
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1005,
        dmId: -1,
        notificationMessage: 'bobmarley added you to test2'
      },
      {
        channelId: -1000,
        dmId: -1,
        notificationMessage: 'bobmarley added you to test'
      },
      ]
    });
  });
  test('TEST 4 | notification for tagging a person not in a channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    send(user.token, channel.channelId, 'hi @timtamtimtam');
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1000,
        dmId: -1,
        notificationMessage: 'bobmarley added you to test'
      }]
    });
  });
  test('TEST 5 | notification for tagging a person in a channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    send(user.token, channel.channelId, 'hi @timtam wow');
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley tagged you in test: {hi @timtam wow}'
        },
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley added you to test'
        }]
    });
  });
  test('TEST 6 | notification for reacting to a message in a channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    send(user.token, channel.channelId, 'hi @timtam wow');
    const message = send(user1.token, channel.channelId, 'hi @titam wow');
    react(user1.token, message.messageId, 1);
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'timtam reacted to your message in test'
        },
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley tagged you in test: {hi @timtam wow}'
        },
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley added you to test'
        }]
    });
  });
  test('TEST 7 | notification for editing a message', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const channel = create(user.token, 'test', true);
    invite(user.token, channel.channelId, user1.authUserId);
    const mess = send(user.token, channel.channelId, 'hi @timtam wow');
    edit(user.token, mess.messageId, '@timtam hi hi @timtam');
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley tagged you in test: {hi @timtam wow}'
        },
        {
          channelId: -1000,
          dmId: -1,
          notificationMessage: 'bobmarley added you to test'
        }]
    });
  });
});
describe('TEST DM PARAMETER', () => {
  test('TEST 1 | invalid token', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    dmCreate(user.token, [user1.authUserId]);
    expect(notifications('djncj')).toEqual(403);
  });
  test('TEST 2 | notification for adding to a dm', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    dmCreate(user.token, [user1.authUserId]);
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1,
        dmId: 0,
        notificationMessage: 'bobmarley added you to bobmarley, timtam'
      }]
    });
  });
  test('TEST 3 | notification for adding to multiple channel', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    dmCreate(user.token, [user1.authUserId]);
    dmCreate(user.token, [user1.authUserId]);
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1,
        dmId: 1,
        notificationMessage: 'bobmarley added you to bobmarley, timtam'
      },
      {
        channelId: -1,
        dmId: 0,
        notificationMessage: 'bobmarley added you to bobmarley, timtam'
      },
      ]
    });
  });
  test('TEST 4 | notification for tagging a person not in a dm', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const dm = dmCreate(user.token, [user1.authUserId]);
    senddm(user.token, dm.dmId, 'hi @timtamtimtam');
    expect(notifications(user1.token)).toEqual({
      notifications: [{
        channelId: -1,
        dmId: 0,
        notificationMessage: 'bobmarley added you to bobmarley, timtam'
      }]
    });
  });
  test('TEST 5 | notification for tagging a person in a dm', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const dm = dmCreate(user.token, [user1.authUserId]);
    senddm(user.token, dm.dmId, 'hi @timtam wow');
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'bobmarley tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'bobmarley added you to bobmarley, timtam'
        }]
    });
  });
  test('TEST 6 | notification for reacting to a message in a dm', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const dm = dmCreate(user.token, [user1.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'hi @timtam wow');
    react(user1.token, message.messageId, 1);
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam reacted to your message in bobmarley, timtam'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'bobmarley added you to bobmarley, timtam'
        }]
    });
  });
  test('TEST 7 | notification more than 20', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
    const dm = dmCreate(user.token, [user1.authUserId]);
    const message = senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    senddm(user1.token, dm.dmId, 'hi @timtam wow');
    react(user1.token, message.messageId, 1);
    expect(notifications(user1.token)).toEqual({
      notifications: [
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam reacted to your message in bobmarley, timtam'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        },
        {
          channelId: -1,
          dmId: 0,
          notificationMessage: 'timtam tagged you in bobmarley, timtam: {hi @timtam wow}'
        }]
    });
  });
  test('TEST 8 | user does no have notification', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    expect(notifications(user.token)).toEqual({ notifications: [] });
  });
});
test('TEST 9 | notification for editing a message', () => {
  const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
  const user1 = register('bobi@gmail.com', 'hello123', 'tim', 'tam');
  const dm = dmCreate(user.token, [user1.authUserId]);
  const mess = senddm(user.token, dm.dmId, 'hi @timtam wow');
  edit(user.token, mess.messageId, '@timtam hi @timtam');
  expect(notifications(user1.token)).toEqual({
    notifications: [
      {
        channelId: -1,
        dmId: 0,
        notificationMessage: 'bobmarley tagged you in bobmarley, timtam: {hi @timtam wow}'
      },
      {
        channelId: -1,
        dmId: 0,
        notificationMessage: 'bobmarley added you to bobmarley, timtam'
      }]
  });
});

describe('HTTP tests for messagePinV1 using jest', () => {
  test('tokenInvalid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;
    // invalid token.
    const pinResult = pin('AssAS//SSsdfd+-', messageId);
    expect(pinResult).toBe(403);
  });

  test('User not being a global owner or DM owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    // not DM owner so can't pin and return error.
    const pinResult = pin(registerToken2, messageId);
    expect(pinResult).toBe(403);
  });

  test('User not being a global owner or channel owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken1, channelId1, registerAuthId2);

    // sending a message to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId = MessageSendResult.messageId;

    // not channel owner or global owner (just a member) so can't pin and return error.
    const pinResult = pin(registerToken2, messageId);
    expect(pinResult).toBe(403);
  });

  test('Being a global owner and pinning someone elses message in a channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token.
    const userRegister2 = register('marek@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the second person who registered.
    const channel1 = create(registerToken2, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken2, channelId1, registerAuthId1);

    // sending messages to channel.
    send(registerToken2, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken2, channelId1, 'bye');

    // global owner pinning someone elses message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
  });

  test('Being an owner and pinning someone elses message in a channel', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a channel using the token of the 3rd person who registered.
    const channel1 = create(registerToken3, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken3, channelId1, registerAuthId2);

    // sending messages to channel.
    send(registerToken2, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken2, channelId1, 'bye');

    // channel owner pinning someone elses message.
    const pinResult = pin(registerToken3, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msg(registerToken3, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
  });

  test('Being an DM owner and pinning someone elses message in a DM', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 3rd person who registered.
    const dm1 = createdm(registerToken3, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken2, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken2, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken2, dmId1, 'bye');

    // DM owner pinning someone elses message.
    const pinResult = pin(registerToken3, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msgDm(registerToken3, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
  });

  test('MessageId not being within users channels and DMs', () => {
    // Creates one user and collects their token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 2nd person who registered.
    createdm(registerToken2, []);

    // Creates a second DM using the token of the 1st person who registered.
    const dm2 = createdm(registerToken3, []);
    const dmId2 = dm2.dmId;

    // sending a message to DM2.
    const MessageSendResult = senddm(registerToken3, dmId2, 'hello');
    const messageId = MessageSendResult.messageId;

    // DM owner of a different sever trying to pin someone elses message on a different DM, returning an error.
    const pinResult = pin(registerToken2, messageId);
    expect(pinResult).toBe(400);
  });

  test('successful pin in channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    send(registerToken1, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken1, channelId1, 'bye');

    // channel owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
  });

  test('successful pin in DM', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken1, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken1, dmId1, 'bye');

    // DM owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msgDm(registerToken1, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
  });

  test('channel message already pinned', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    send(registerToken1, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken1, channelId1, 'bye');

    // channel owner pinning their message.
    let pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
    // channel owner pinning their same message again. error.
    pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toBe(400);
  });

  test('DM message already pinned', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken1, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken1, dmId1, 'bye');

    // DM owner pinning their message.
    let pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msgDm(registerToken1, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);
    // DM owner pinning their same message again. error.
    pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toBe(400);
  });
  test('user does not privileege', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const userRegister2 = register('madrk@gmail.com', 'password', 'duck', 'man');
    // Creates a DM using the token of the 1st person who registered.
    const channel = create(registerToken1, 'test', true);
    join(userRegister2.token, channel.channelId);
    const mess = send(registerToken1, channel.channelId, 'test');
    expect(pin(userRegister2.token, mess.messageId)).toEqual(403);
  });
});

describe('HTTP tests for messageUnpinV1 using jest', () => {
  test('tokenInvalid', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;
    // invalid token.
    const unpinResult = unpin('AssAS//SSsdfd+-', messageId);
    expect(unpinResult).toBe(403);
  });

  test('User not being a global owner or DM owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their token and uId.
    const userRegister2 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = createdm(registerToken1, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending a message to DM.
    const dmMessageSendResult = senddm(registerToken1, dmId1, 'hello');
    const messageId = dmMessageSendResult.messageId;

    // Pinning a message.
    const pinResult = pin(registerToken1, messageId);
    expect(pinResult).toStrictEqual({});

    // not DM owner so can't unpin and return error.
    const unpinResult = unpin(registerToken2, messageId);
    expect(unpinResult).toBe(403);
  });

  test('User not being a global owner or channel owner', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the first person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken1, channelId1, registerAuthId2);

    // sending a message to channel.
    const MessageSendResult = send(registerToken1, channelId1, 'hello');
    const messageId = MessageSendResult.messageId;

    // Pinning a message.
    const pinResult = pin(registerToken1, messageId);
    expect(pinResult).toStrictEqual({});

    // not channel owner or global owner (just a member) so can't unpin and return error.
    const unpinResult = unpin(registerToken2, messageId);
    expect(unpinResult).toBe(403);
  });

  test('Being a global owner and unpinning someone elses message in a channel', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates one user and collects their token.
    const userRegister2 = register('marek@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates a channel using the token of the second person who registered.
    const channel1 = create(registerToken2, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken2, channelId1, registerAuthId1);

    // sending messages to channel.
    send(registerToken2, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken2, channelId1, 'bye');

    // global owner pinning someone elses message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // global owner unpinning someone elses message.
    const unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msg(registerToken1, channelId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
  });

  test('Being an owner and unpinning someone elses message in a channel', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a channel using the token of the 3rd person who registered.
    const channel1 = create(registerToken3, 'happy', true);
    const channelId1 = channel1.channelId;
    invite(registerToken3, channelId1, registerAuthId2);

    // sending messages to channel.
    send(registerToken2, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken2, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken2, channelId1, 'bye');

    // channel owner pinning someone elses message.
    const pinResult = pin(registerToken3, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msg(registerToken3, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // channel owner unpinning someone elses message.
    const unpinResult = unpin(registerToken3, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msg(registerToken3, channelId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
  });

  test('Being an DM owner and unpinning someone elses message in a DM', () => {
    // Creates one user and collects their uId and token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerAuthId2 = userRegister2.authUserId;
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marke@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 3rd person who registered.
    const dm1 = createdm(registerToken3, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken2, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken2, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken2, dmId1, 'bye');

    // DM owner pinning someone elses message.
    const pinResult = pin(registerToken3, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msgDm(registerToken3, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // DM owner unpinning someone elses message.
    const unpinResult = unpin(registerToken3, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msgDm(registerToken3, dmId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
  });

  test('MessageId not being within users channels and DMs', () => {
    // Creates one user and collects their token.
    const userRegister2 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken2 = userRegister2.token;

    // Creates one user and collects their token.
    const userRegister3 = register('marek@gmail.com', 'password', 'duck', 'man');
    const registerToken3 = userRegister3.token;

    // Creates a DM using the token of the 2nd person who registered.
    createdm(registerToken2, []);

    // Creates a second DM using the token of the 1st person who registered.
    const dm2 = createdm(registerToken3, []);
    const dmId2 = dm2.dmId;

    // sending a message to DM2.
    const MessageSendResult = senddm(registerToken3, dmId2, 'hello');
    const messageId = MessageSendResult.messageId;

    // DM owner pinning someone elses message.
    const pinResult = pin(registerToken3, messageId);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    const messages = msgDm(registerToken3, dmId2, 0);
    const pinnedMessage = messages.messages[0].isPinned;

    expect(pinnedMessage).toBe(true);

    // DM owner of a different sever trying to unpin someone elses message on a different DM, returning an error.
    const unpinResult = unpin(registerToken2, messageId);
    expect(unpinResult).toBe(400);
  });

  test('successful unpin in channel', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    send(registerToken1, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken1, channelId1, 'bye');

    // channel owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // channel owner unpinning their message.
    const unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msg(registerToken1, channelId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
  });

  test('successful unpin in DM', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken1, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken1, dmId1, 'bye');

    // DM owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msgDm(registerToken1, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // DM owner unpinning their message.
    const unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msgDm(registerToken1, dmId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
  });

  test('channel message not pinned', () => {
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    send(registerToken1, channelId1, 'hello');
    const MessageSendResult2 = send(registerToken1, channelId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    send(registerToken1, channelId1, 'bye');

    // channel owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msg(registerToken1, channelId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // channel owner unpinning their message.
    let unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msg(registerToken1, channelId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
    // channel owner unpinning same message again.
    unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toBe(400);
  });

  test('DM message not pinned', () => {
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the 1st person who registered.
    const dm1 = createdm(registerToken1, []);
    const dmId1 = dm1.dmId;

    // sending messages to DM.
    senddm(registerToken1, dmId1, 'hello');
    const MessageSendResult2 = senddm(registerToken1, dmId1, 'hel');
    const messageId2 = MessageSendResult2.messageId;
    senddm(registerToken1, dmId1, 'bye');

    // DM owner pinning their message.
    const pinResult = pin(registerToken1, messageId2);
    expect(pinResult).toStrictEqual({});

    // checking message pinned.
    let messages = msgDm(registerToken1, dmId1, 0);
    const pinnedMessage = messages.messages[1].isPinned;

    expect(pinnedMessage).toBe(true);

    // DM owner unpinning their message.
    let unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toStrictEqual({});

    // checking message unpinned.
    messages = msgDm(registerToken1, dmId1, 0);
    const unpinnedMessage = messages.messages[1].isPinned;

    expect(unpinnedMessage).toBe(false);
    // DM owner unpinning same message again.
    unpinResult = unpin(registerToken1, messageId2);
    expect(unpinResult).toBe(400);
  });
  test('message is unpinned in channel', () => {
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    // sending messages to channel.
    const messageId = send(registerToken1, channelId1, 'hello');
    expect(unpin(registerToken1, messageId.messageId)).toEqual(400);
  });
  test('user is not authorised unpinned in channel', () => {
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const userRegister2 = register('markh@gmail.com', 'password', 'duck', 'man');
    // Creates a channel using the token of the 1st person who registered.
    const channel1 = create(registerToken1, 'happy', true);
    const channelId1 = channel1.channelId;

    join(userRegister2.token, channelId1);
    // sending messages to channel.
    const messageId = send(registerToken1, channelId1, 'hello');
    pin(registerToken1, messageId.messageId);
    expect(unpin(userRegister2.token, messageId.messageId)).toEqual(403);
  });
});
