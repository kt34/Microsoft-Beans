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
const list = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/channels/list/v3`,
    {
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const listChannel = JSON.parse(res.getBody() as string);
  return listChannel;
};
const listall = (token) => {
  const res = request(
    'GET',
    `${url}:${port}/channels/listall/v3`,
    {
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  const listAllChannel = JSON.parse(res.getBody() as string);
  return listAllChannel;
};
beforeEach(() => {
  clear();
});

describe('channelsCreateV3', () => {
  test('correct parameters 1', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const example1 = create(user.token, 'channel1', true);

    expect(example1).toStrictEqual({ channelId: -1000 });
  });
  test('correct parameters 2', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobby@gmail.com', 'helflo123', 'bobby', 'marley');

    const example1 = create(user.token, 'channel1', true);
    const example2 = create(user1.token, 'channel2', false);
    expect(example1).toStrictEqual({ channelId: -1000 });
    expect(example2).toStrictEqual({ channelId: -1005 });
  });
  test('length of name is invalid', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bobby@gmail.com', 'helflo123', 'bobby', 'marley');

    const shortName = create(user.token, '', true);
    const longName = create(user1.token, 'channel123456789101112131415', false);

    expect(shortName).toStrictEqual(400);
    expect(longName).toStrictEqual(400);
  });
  test('token is invalid', () => {
    register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const invalidUID = create('1005', 'channel1', true);

    expect(invalidUID).toStrictEqual(403);
  });
  test('empty string', () => {
    register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const invalidUID = create('', 'channel1', true);

    expect(invalidUID).toStrictEqual(403);
  });
});
describe('channelsListV3', () => {
  test('correct parameters, one output', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);

    expect(list(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }] });
  });

  test('correct parameters, multiple output', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);
    create(token, 'channel2', true);
    create(token, 'channel3', true);

    expect(list(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }, { channelId: -1010, name: 'channel3' }] });
  });

  test('correct parameters, one public, one private', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', false);
    create(token, 'channel2', true);

    expect(list(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }] });
  });

  test('wrong parameters, all private', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', false);
    create(token, 'channel2', false);
    create(token, 'channel3', false);

    expect(list(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }, { channelId: -1010, name: 'channel3' }] });
  });

  test('wrong parameters, token invalid', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);

    expect(list('1005')).toEqual(403);
  });

  test('wrong parameters, no channels', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    expect(list(token)).toEqual({ channels: [] }
    );
  });

  test('wrong parameters, token is an empty string', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);

    expect(list('')).toEqual(403);
  });
});
describe('channelsListAllV3', () => {
  test('correct parameters, one output', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');

    const token = user.token;

    create(token, 'channel1', true);

    expect(listall(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }] });
  });

  test('correct parameters, multiple output', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);
    create(token, 'channel2', true);
    create(token, 'channel3', true);

    expect(listall(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }, { channelId: -1010, name: 'channel3' }] });
  });

  test('correct parameters, one public, one private', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', false);
    create(token, 'channel2', true);

    expect(listall(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }] });
  });

  test('correct parameters, all private', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', false);
    create(token, 'channel2', false);
    create(token, 'channel3', false);

    expect(listall(token)).toEqual({ channels: [{ channelId: -1000, name: 'channel1' }, { channelId: -1005, name: 'channel2' }, { channelId: -1010, name: 'channel3' }] });
  });

  test('wrong parameters, token invalid', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);

    expect(listall('1005')).toEqual(403);
  });

  test('wrong parameters, no channels', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    expect(listall(token)).toEqual({ channels: [] });
  });

  test('wrong parameters, token is an empty string', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    create(token, 'channel1', true);

    expect(listall('')).toEqual(403);
  });
});
