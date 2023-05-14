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

const dmList = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/dm/list/v2`,
    {
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const newDmList = JSON.parse(res.body as string);
  return newDmList;
};

const dmRemove = (token, dmId) => {
  const res = request(
    'DELETE',
    `${url}:${port}/dm/remove/v2`,
    {
      qs: {
        dmId: dmId,
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const newDmRemove = JSON.parse(res.body as string);
  return newDmRemove;
};

const dmDetails = (token, dmId) => {
  const res = request(
    'GET',
    `${url}:${port}/dm/details/v2`,
    {
      qs: {
        dmId: dmId,
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const newDmDetails = JSON.parse(res.body as string);
  return newDmDetails;
};

const send = (token, dmId, message) => {
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
const message = (token, dmId, start) => {
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

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const messages = JSON.parse(res.body as string);
  return messages;
};

const dmLeave = (token, dmId) => {
  const res = request(
    'POST',
    `${url}:${port}/dm/leave/v2`,
    {
      json: {
        dmId: dmId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const dmLeave = JSON.parse(res.body as string);

  return dmLeave;
};

const toFindDuplicates = (array) => array.filter((item, index) => array.indexOf(item) !== index);

function messageArrayCreator(number, message, messageId, uId, start) {
  const messages = [];
  for (let i = start; i < number; i++) {
    messages.push({
      messageId: messageId[i],
      uId: uId,
      message: message[i],
      timeSent: expect.any(Number),
      reacts: [
        {
          reactId: 1,
          uIds: [],
          isThisUserReacted: false
        }
      ],
      isPinned: false
    });
  }
  return messages;
}

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

describe('dmCreate Correct', () => {
  test('testing correct multiple users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
  });
  test('testing correct dm id being new', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    const dm1 = dmCreate(token, [id1, id2, id3]);
    dmRemove(user0.token, dm1.dmId);
  });

  test('testing with multiple dm creates', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmCreate(token, [id1, id2])).toStrictEqual({ dmId: 1 });
    expect(dmCreate(token, [id1, id3])).toStrictEqual({ dmId: 2 });
  });

  test('testing with no id called', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;

    expect(dmCreate(token, [])).toStrictEqual({ dmId: 0 });
  });
});

describe('dmCreate Error', () => {
  test('uId does not refer to a valid user with only 1 user', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;

    expect(dmCreate(token, [{ authUserId: 354 }])).toStrictEqual(400);
  });

  test('uId does not refer to a valid user with multiple users', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;

    expect(dmCreate(token, [id1, id2, { authUserId: 123 }])).toStrictEqual(400);
  });

  test('duplicate uIds in the uIds with only 1 id', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    expect(dmCreate(token, [id1, id1])).toStrictEqual(400);
  });

  test('duplicate uIds in the uIds with multiple ids', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3, id1])).toStrictEqual(400);
  });

  // email is empty string
  test('token is invalid', () => {
    clear();

    register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate({ token: 'c' }, [id1, id2, id3])).toStrictEqual(403);
  });
});
// DMLIST

describe('dmList Correct', () => {
  test('testing correct one users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmList(token)).toStrictEqual({ dms: [{ dmId: 0, name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2' }] });
  });

  test('testing with one user in multiple dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmCreate(token, [id1, id2])).toStrictEqual({ dmId: 1 });
    expect(dmCreate(token, [id1, id3])).toStrictEqual({ dmId: 2 });
    expect(dmList(token)).toStrictEqual({
      dms: [
        { dmId: 0, name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2' },
        { dmId: 1, name: 'bobmarley, bobmarley0, bobmarley1' },
        { dmId: 2, name: 'bobmarley, bobmarley0, bobmarley2' }
      ]
    });
  });

  test('testing with one user in multiple dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmCreate(token, [id1, id2])).toStrictEqual({ dmId: 1 });
    expect(dmCreate(token, [id1, id3])).toStrictEqual({ dmId: 2 });
    expect(dmList(token)).toStrictEqual({
      dms: [
        { dmId: 0, name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2' },
        { dmId: 1, name: 'bobmarley, bobmarley0, bobmarley1' },
        { dmId: 2, name: 'bobmarley, bobmarley0, bobmarley2' }
      ]
    });
  });

  test('testing with multiple user in other dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;
    const token1 = user1.token;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmList(token1)).toStrictEqual({
      dms: [
        { dmId: 0, name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2' },
      ]
    });
  });

  test('testing with user with no dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;

    expect(dmList(token)).toStrictEqual({ dms: [] });
  });
});

describe('dmList Error', () => {
  test('token is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmList('d')).toStrictEqual(403);
  });
});

// DMREMOVE

describe('dmRemove Correct', () => {
  test('testing correct one users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmRemove(token, 0)).toStrictEqual({});
    expect(dmList(token)).toStrictEqual({ dms: [] });
  });

  test('testing with one user in multiple dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    expect(dmCreate(token, [id1, id2])).toStrictEqual({ dmId: 1 });
    expect(dmCreate(token, [id1, id3])).toStrictEqual({ dmId: 2 });
    dmRemove(token, 2);
    expect(dmList(token)).toStrictEqual({
      dms: [
        { dmId: 0, name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2' },
        { dmId: 1, name: 'bobmarley, bobmarley0, bobmarley1' }
      ]
    });
  });
});

describe('dmRemove Error', () => {
  test('dmId is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmRemove(token, 3)).toStrictEqual(400);
  });
  test('dmId is valid and the authorised user is not the original dm creator', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const token1 = user1.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmRemove(token1, 0)).toStrictEqual(403);
  });
  test('token is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmRemove('token', 3)).toStrictEqual(403);
  });
});

// DMDETAILS

describe('dmDetails Correct', () => {
  test('testing correct one users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;

    expect(dmCreate(token, [])).toStrictEqual({ dmId: 0 });
    expect(dmDetails(token, 0)).toStrictEqual({
      name: 'bobmarley',
      members: [{
        uId: 1000,
        email: 'hello@gmail.com',
        nameFirst: 'bob',
        nameLast: 'marley',
        handleStr: 'bobmarley'
      }]
    });
  });

  test('testing with one user in multiple dms', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;

    expect(dmCreate(token, [id1, id2])).toStrictEqual({ dmId: 0 });
    expect(dmDetails(token, 0)).toStrictEqual({
      name: 'bobmarley, bobmarley0, bobmarley1',
      members: [{
        uId: 1005,
        email: 'bob@gmail.com',
        nameFirst: 'bob',
        nameLast: 'marley',
        handleStr: 'bobmarley0'
      },
      {
        uId: 1010,
        email: 'bobo@gmail.com',
        nameFirst: 'bob',
        nameLast: 'marley',
        handleStr: 'bobmarley1'
      },
      {
        uId: 1000,
        email: 'hello@gmail.com',
        nameFirst: 'bob',
        nameLast: 'marley',
        handleStr: 'bobmarley'
      }]
    });
  });
});

describe('dmDetails Error', () => {
  test('dmId is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmDetails(token, 3)).toStrictEqual(400);
  });
  test('dmId is valid and the authorised user is not a member of the dm', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const token2 = user2.token;

    dmCreate(token, [id1]);
    expect(dmDetails(token2, 0)).toStrictEqual(403);
  });
  test('token is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmDetails('token', 3)).toStrictEqual(403);
  });
});

// Tests used to test the messageSendDmV2 function.
describe('HTTP tests for messageSendDmV2 using jest', () => {
  test('dmId does not exist', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Trying to send message to a dmId that doesn't exist. Error.
    const dmMessageSendResult = send(registerToken1, -777777, 'hello');
    expect(dmMessageSendResult).toBe(400);
  });

  test('token is invalid', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Inputting an invalid token and getting an error for it.
    const dmMessageSendResult = send('-A+b/|?123', dmId1, 'hello');
    expect(dmMessageSendResult).toBe(403);
  });

  test('dmId valid but user of token is not a member of it', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their token.
    const userRegister2 = register('dog@gmail.com', 'landslide', 'cow', 'meow');
    const registerToken2 = userRegister2.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // 2nd registered user tries sending message in first registered users DM,
    // however, they are not apart of that DM. Returns error.
    const dmMessageSendResult = send(registerToken2, dmId1, 'hello');
    expect(dmMessageSendResult).toBe(403);
  });

  test('Given a message smaller than length 1', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Trying to send message that is too small. Error.
    const dmMessageSendResult = send(registerToken1, dmId1, '');
    expect(dmMessageSendResult).toBe(400);
  });

  test('Given a message equal to length 1', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const dmMessageSendResult = send(registerToken1, dmId1, 'a');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Given a message equal to length 1000', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Trying to send message of length 1000. Return messageId object.
    const dmMessageSendResult = send(registerToken1, dmId1, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Given a message greater than length 1000', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Trying to send message of length greater than 1000. Return Error.
    const dmMessageSendResult = send(registerToken1, dmId1, 'helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssshelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssss');
    expect(dmMessageSendResult).toBe(400);
  });

  test('Test successful case of one user sending messages to a DM', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Inputting messages in DM from one user. Returns messageId objects.
    let dmMessageSendResult = send(registerToken1, dmId1, 'hello');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken1, dmId1, 'yayayayaya');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken1, dmId1, 'pingpong');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Test successful case of two users sending messages to a DM', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their uId and token.
    const userRegister2 = register('duck@gmail.com', 'passaaaword', 'dsdsuck', 'mffan');
    const registerToken2 = userRegister2.token;
    const registerAuthId2 = userRegister2.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, [registerAuthId2]);
    const dmId1 = dm1.dmId;

    // Inputting messages in DM from two users. Returns messageId objects.
    let dmMessageSendResult = send(registerToken1, dmId1, 'hello');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken1, dmId1, 'yayayayaya');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken1, dmId1, 'pingpong');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken2, dmId1, 'hello');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken2, dmId1, 'yayayayaya');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
    dmMessageSendResult = send(registerToken2, dmId1, 'pingpong');
    expect(dmMessageSendResult).toStrictEqual({ messageId: expect.any(Number) });
  });
});

describe('dmLeaveV1 Correct', () => {
  test('testing correct one users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;

    expect(dmCreate(token, [])).toStrictEqual({ dmId: 0 });

    dmLeave(token, 0);
    expect(dmDetails(token, 0)).toStrictEqual(403);
  });
  test('testing correct multiple users', () => {
    clear();
    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    const user3 = register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const token1 = user2.token;
    const id1 = user1.authUserId;
    const id2 = user2.authUserId;
    const id3 = user3.authUserId;

    expect(dmCreate(token, [id1, id2, id3])).toStrictEqual({ dmId: 0 });
    dmLeave(token1, 0);
    expect(dmDetails(token, 0)).toStrictEqual({
      name: 'bobmarley, bobmarley0, bobmarley1, bobmarley2',
      members: [
        {
          uId: 1005,
          email: 'bob@gmail.com',
          nameFirst: 'bob',
          nameLast: 'marley',
          handleStr: 'bobmarley0'
        },
        {
          uId: 1015,
          email: 'bobi@gmail.com',
          nameFirst: 'bob',
          nameLast: 'marley',
          handleStr: 'bobmarley2'
        },
        {
          uId: 1000,
          email: 'hello@gmail.com',
          nameFirst: 'bob',
          nameLast: 'marley',
          handleStr: 'bobmarley'
        }
      ]
    });
  });
});

describe('dmLeave Error', () => {
  test('dmId is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmLeave(token, 3)).toStrictEqual(400);
  });
  test('dmId is valid and the authorised user is not a member of the dm', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user2 = register('bobo@gmail.com', 'hello123', 'bob', 'marley');
    register('bobi@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;
    const token2 = user2.token;

    dmCreate(token, [id1]);
    expect(dmLeave(token2, 0)).toStrictEqual(403);
  });
  test('token is invalid', () => {
    clear();

    const user0 = register('hello@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token = user0.token;
    const id1 = user1.authUserId;

    dmCreate(token, [id1]);
    expect(dmLeave('token', 3)).toStrictEqual(403);
  });
});

describe('HTTP test for dmMessagesV2 using jest', () => {
  test('When the dmId is not valid', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    dmCreate(registerToken1, []);
    // Checking the messages of a DM using an invalid dmId. Expect an error.
    const dmMessagesResult = message(registerToken1, -7777777111111, 0);
    expect(dmMessagesResult).toBe(400);
  });

  test('When the start greater than total number of messages in DM', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Using a start value greater than the number of messages there are. Expect an error.
    // Here there are 0 messages yet we are starting at second message, which doesn't exist.
    const dmMessagesResult = message(registerToken1, dmId1, 1);
    expect(dmMessagesResult).toBe(400);
  });

  test('dmId valid, however, authUserId representing the token and requesting messages from DM is not part of it', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates another user and collects their token.
    const userRegister2 = register('g@gmail.com', 'ldslidee', 'aacow', 'aameow');
    const registerToken2 = userRegister2.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Second registered user requests messages from the first registered users DM, but they are
    // not a member of it, yet it exists. Causing expected outcome to be an error.
    const dmMessagesResult = message(registerToken2, dmId1, 0);
    expect(dmMessagesResult).toBe(403);
  });

  test('Using an invalid token', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Trying to retreive messages using an invalid token. Expect an error.
    const dmMessagesResult = message('-A+b/|?123', dmId1, 0);
    expect(dmMessagesResult).toBe(403);
  });

  test('When start equals number of messages', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // There are 0 messages (since DM was just made) and we are starting at message 0
    // (first message), so we get an empty array and 'end' becomes -1.
    const dmMessagesResult = message(registerToken1, dmId1, 0);
    expect(dmMessagesResult).toStrictEqual({ messages: [], start: 0, end: -1 });
  });

  test('When start equals number of messages; test number 2', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // Sends some messages into the DM.
    send(registerToken1, dmId1, 'hello');
    send(registerToken1, dmId1, 'hell');
    send(registerToken1, dmId1, 'hel');

    // There are 3 messages and we are starting at value 3, so we get
    // an empty array and 'end' becomes -1.
    const dmMessagesResult = message(registerToken1, dmId1, 3);
    expect(dmMessagesResult).toStrictEqual({ messages: [], start: 3, end: -1 });
  });

  test('When start is a negative value', () => {
    clear();
    // Creates one user and collects their token.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    // There are 0 messages (since DM was just made) and we are starting at message -1,
    // which isn't possible, so we get an error as an outcome.
    const dmMessagesResult = message(registerToken1, dmId1, -1);
    expect(dmMessagesResult).toBe(400);
  });

  test('When there is less than 50 messages and start is less than number of messages', () => {
    clear();
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const messageIds = [];
    const messages = [];
    // loops used to add 49 messages to a DM.
    for (let i = 0; i < 49; i++) {
      const msgId = send(registerToken1, dmId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 49 messages.
    const dmMessagesResult = message(registerToken1, dmId1, 0);
    expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(49, messages, messageIds, registerAuthId1, 0), start: 0, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(49);
  });

  test('When there is less than 50 messages and start is less than number of messages; test number 2', () => {
    clear();
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const messageIds = [];
    const messages = [];
    // loops used to add 40 messages to a DM.
    for (let i = 0; i < 40; i++) {
      const msgId = send(registerToken1, dmId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 28 messages.
    const dmMessagesResult = message(registerToken1, dmId1, 12);
    expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(40, messages, messageIds, registerAuthId1, 12), start: 12, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(40);
  });

  test('When there is more than 50 messages and start is less than number of messages', () => {
    clear();
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const messageIds = [];
    const messages = [];
    // loops used to add 51 messages to a DM.
    for (let i = 0; i < 51; i++) {
      const msgId = send(registerToken1, dmId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    let loopNum = 0;
    let end = 0;
    let start = 0;

    // seeing if right outcomes happens when undergoing pagination.
    while (end !== -1) {
      const dmMessagesResult = message(registerToken1, dmId1, start);
      if (loopNum === 1) {
        expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(51, messages, messageIds, registerAuthId1, 50), start: 50, end: -1 });
        end = -1;
      } else {
        expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(50, messages, messageIds, registerAuthId1, 0), start: 0, end: 50 });
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
    clear();
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const messageIds = [];
    const messages = [];
    // loops used to add 70 messages to a DM.
    for (let i = 0; i < 70; i++) {
      const msgId = send(registerToken1, dmId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    let loopNum = 0;
    let end = 0;
    let start = 10;

    // seeing if right outcomes happens when undergoing pagination.
    while (end !== -1) {
      const dmMessagesResult = message(registerToken1, dmId1, start);
      if (loopNum === 1) {
        expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(70, messages, messageIds, registerAuthId1, 60), start: 60, end: -1 });
        end = -1;
      } else {
        expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(60, messages, messageIds, registerAuthId1, start), start: 10, end: 60 });
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
    clear();
    // Creates one user and collects their token and uId.
    const userRegister1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const registerToken1 = userRegister1.token;
    const registerAuthId1 = userRegister1.authUserId;

    // Creates a DM using the token of the first person who registered.
    const dm1 = dmCreate(registerToken1, []);
    const dmId1 = dm1.dmId;

    const messageIds = [];
    const messages = [];
    // loops used to add 50 messages to a DM.
    for (let i = 0; i < 50; i++) {
      const msgId = send(registerToken1, dmId1, i.toString());
      messageIds.push(msgId.messageId);
      messages.push(i.toString());
    }
    const duplicateIdsArray = toFindDuplicates(messageIds);

    // Expect end to be -1 since there isnt any more messages after it reads in the 50 messages.
    const dmMessagesResult = message(registerToken1, dmId1, 0);
    expect(dmMessagesResult).toStrictEqual({ messages: messageArrayCreator(50, messages, messageIds, registerAuthId1, 0), start: 0, end: -1 });
    // Checks that no Id is duplicated.
    expect(duplicateIdsArray).toStrictEqual([]);
    // Checks number of Ids made equals number of messages made.
    expect(messageIds.length).toBe(50);
  });
  test('message react channelDms should return ', () => {
    clear();
    // Creates one user and collects their token and uId.
    const user1 = register('mark@gmail.com', 'password', 'duck', 'man');
    const user2 = register('marks@gmail.com', 'password', 'duck', 'man');
    const user3 = register('markas@gmail.com', 'password', 'duck', 'man');

    const dm = dmCreate(user1.token, [user2.authUserId, user3.authUserId]);
    const msg = send(user1.token, dm.dmId, 'dksjdldads');
    react(user1.token, msg.messageId, 1);

    expect(message(user1.token, dm.dmId, 0)).toStrictEqual({
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
