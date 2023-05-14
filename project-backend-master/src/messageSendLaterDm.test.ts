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
const create = (token, uIds) => {
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

const sendLater = (token, dmId, message, timeSent) => {
  const res = request(
    'POST',
        `${url}:${port}/message/sendlaterdm/v1`,
        {
          json: {
            dmId: dmId,
            message: message,
            timeSent: timeSent,
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const messageSentLater = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  return messageSentLater;
};
beforeEach(() => {
  clear();
});

jest.setTimeout(60000);
jest.useRealTimers();

describe('TEST CORRECT PARAMETER', () => {
  test('TEST 1 | send a single message', async () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    const result = sendLater(token, dm.dmId, 'hi hello', time);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result).toEqual({ messageId: time });
  });
  test('TEST 2 | send multiple message', async () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    const result = sendLater(token, dm.dmId, 'hi hello', time);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result).toEqual({ messageId: time });

    const time1 = Math.floor((new Date()).getTime() / 1000) + 1;
    const result1 = sendLater(token, dm.dmId, 'hi helloggg', time1);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result1).toEqual({ messageId: time1 });

    const time2 = Math.floor((new Date()).getTime() / 1000) + 1;
    const result2 = sendLater(token, dm.dmId, 'hi hellofff', time2);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result2).toEqual({ messageId: time2 });
  });
  test('TEST 3 | send multiple messages to different dms', async () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const dm1 = create(token, []);
    const dm2 = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    const result = sendLater(token, dm.dmId, 'hi hello', time);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result).toEqual({ messageId: time });

    const time1 = Math.floor((new Date()).getTime() / 1000) + 1;
    const result1 = sendLater(token, dm1.dmId, 'hi helloggg', time1);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result1).toEqual({ messageId: time1 });

    const time2 = Math.floor((new Date()).getTime() / 1000) + 1;
    const result2 = sendLater(token, dm2.dmId, 'hi hellofff', time2);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result2).toEqual({ messageId: time2 });
  });
});

describe('TEST INCORRECT PARAMETER', () => {
  test('TEST 1 |token invalid', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const dm = create(user.token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    expect(sendLater('dkhskhda', dm.dmId, 'hi hello', time)).toEqual(403);
  });
  test('TEST 1 | dmId does not refer to a valid dm', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    expect(sendLater(token, 15252, 'hi hello', time)).toEqual(400);
  });
  test('TEST 2 | length of message is under 1', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    expect(sendLater(token, dm.dmId, '', time)).toEqual(400);
  });
  test('TEST 3 | length of message is above 1000', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    expect(sendLater(token, dm.dmId, 'zH0vc0OYelSrLAqn2SAs3lzOemIXr6sF9T4XyMDZBcHFCQ7gZQ9jqgbIpIExq3LQVRm2D3lxeYCB3xPVK5cqM665wlBBc7elMjB0J5f4j8eQCtctPTaybMtAr1FJRAHuZluOIZ6y5mYc4HyKQoXjuP4Akkd2f4DPSX1ZzGzaEZpse0BgrlTSEXyqRDYlkWmMFRyJXzcq5nPA6ksQOBkLfIWGH3Snj3Cp2DkDsqb6NiZEOyqa3mCzdeoNHoUiAGBThyd3TLJh6Eu3rUGjOuHMhT8tGGXHR01ztj75RwZhqIcqmO7aiUDQANXbk2PvFA6Gstk8EeSYMVkP04aUxyRIvuL1YEb0TjtfliKNBdy5u0FDrK7V332b9bTBkHKUcwRdKkcD8hv4drJxR1CkJtTgi7QcPnq8R5qW1W1vi9HWEAmrNjCiyvnBenNxYGPLeBuKiqDE22ffbSgVGfRt56I5L7JwyYZtBAC0cyxh1gox97sYK3iOX96lYOpf00dHjQkjrYqb94Zw6y17LX6nmVvns65ElgmYQNQ3D55BNmZgCtdbE1O6N0t6UjACJzpPFaDZ7Q7VcDTSHLIC124gkLV9vTTDw3lSRoBRDFMddnjibuPKcGTDFD9gMCCpgWiq6XTaDJNDSGUhvwgRrKDgwGLyhZhhg9rGJM7Ozus3VTek6T9erPAniP2o4PFHS3N7q5L6UmavTItLQTWe4H90tnutFkdopdVKBeRL9jPRZHrE2IxZtu9dx9s6w2smXCrErUfpwUjndvsSSgQFyWLmBZ7SM9xkzDOaO8V0rRgBdVcyM0ZPxNP1s1JmCiW6rtoTRe22NrXTqUWn52HphM3JlqKBkmLgVfZklxK9cHXYXkiSkRjgRymev60ja0zYNKZdAPwIaGFeFYoCDc8MRhAHMLFkT6cjh5jRcIkAQockqwN1bT5Mp6lVl8Hnfhgw7BriAll2hdLrQmuaR7QbK3FzqtlQfrcZ4nl6fqilPfNXBdz93'
      , time)).toEqual(400);
  });
  test('TEST 4 | timeSent is in the past', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) - 1;
    expect(sendLater(token, dm.dmId, 'hi hello', time)).toEqual(400);
  });
  test('TEST 5 | dmId is valid and the authorised user is not a member of the dm they are trying to post to', () => {
    const user = register('bob@gmail.com', 'hello123', 'bob', 'marley');
    const user1 = register('bffob@gmail.com', 'hellffo123', 'bob', 'marley');
    const token = user.token;
    const dm = create(token, []);
    const time = Math.floor((new Date()).getTime() / 1000) + 1;
    expect(sendLater(user1.token, dm.dmId, 'hi hello', time)).toEqual(403);
  });
});
