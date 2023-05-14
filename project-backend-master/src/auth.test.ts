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

const login = (email, password) => {
  const res = request(
    'POST',
    `${url}:${port}/auth/login/v3`,
    {
      json: {
        email: email,
        password: password,
      },
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const userLogin = JSON.parse(res.body as string);
  return userLogin;
};

const logout = (token) => {
  const res = request(
    'POST',
    `${url}:${port}/auth/logout/v2`,
    {
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const userLogout = JSON.parse(res.body as string);
  return userLogout;
};

const passwordResetRequest = (email) => {
  const res = request(
    'POST',
    `${url}:${port}/auth/passwordreset/request/v1`,
    {
      json: {
        email: email
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const passwordResetRequest = JSON.parse(res.body as string);
  return passwordResetRequest;
};

const passwordResetReset = (resetCode, newPassword) => {
  const res = request(
    'POST',
    `${url}:${port}/auth/passwordreset/reset/v1`,
    {
      json: {
        resetCode: resetCode,
        newPassword: newPassword
      }
    }
  );
  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  const passwordResetReset = JSON.parse(res.body as string);
  return passwordResetReset;
};

beforeEach(() => {
  clear();
});

// AUTHREGISTER
describe('authRegisterV3', () => {
  test('regular name 1', () => {
    clear();
    const example1 = register('abob@gmail.com', 'hello123', 'Ooob', 'Larley');

    expect(example1.authUserId).toStrictEqual(1000);
    expect(example1.token).toStrictEqual(expect.any(String));
  });
  test('regular name 2 all capitals', () => {
    clear();
    const example1 = register('abob@gmail.com', 'helloworld123', 'LIGHT', 'BULB');

    expect(example1.authUserId).toStrictEqual(1000);
    expect(example1.token).toStrictEqual(expect.any(String));
  });
  test('multiple registers', () => {
    clear();

    const example1 = register('bob@gmail.com', 'helloc3213', 'Bobdsfasdfsa', 'cdavbcfdsafdsafsdafads');
    const example2 = register('hello@gmail.com', 'hellocda213', 'Bob', 'wedasda');
    expect(example1.authUserId).toStrictEqual(1000);
    expect(example1.token).toStrictEqual(expect.any(String));
    expect(example2.authUserId).toStrictEqual(1005);
    expect(example2.token).toStrictEqual(expect.any(String));
  });
  test('email is not valid no @', () => {
    const example1 = register('pbobgmail.com', 'hello123', 'Bob', 'Marley');
    expect(example1).toStrictEqual(400);
  });
  test('email is not valid no .com', () => {
    const example1 = register('lbob@gmail', 'hello123', 'Bob', 'Marley');
    expect(example1).toStrictEqual(400);
  });
  test('email is already being used', () => {
    register('rbob@gmail.com', 'hello123', 'Bobo', 'Marleye');
    const example2 = register('rbob@gmail.com', 'hello123', 'bcm', 'poc');
    expect(example2).toStrictEqual(400);
  });
  test('password less than 6 characters', () => {
    const example1 = register('ybob@gmail.com', 'hello', 'Bob', 'Marley');
    expect(example1).toStrictEqual(400);
  });
  test('first name not between 1 and 50 length', () => {
    clear();

    const example1 = register('bhob@gmail.com', 'hell231o', '', 'Marley');
    const example2 = register('bsob@gmail.com', 'he231llo', 'cdiuhcsadncjkdsanncjkdnask' +
    'cnadskjcndskcndkscnksanckcsn', 'Marley');
    expect(example1).toStrictEqual(400);
    expect(example2).toStrictEqual(400);
  });
  test('last name not between 1 and 50 length', () => {
    clear();
    const example1 = register('boqb@gmail.com', 'hell51344o', 'Bob', '');
    const example2 = register('bogb@gmail.com', 'h312341ello', 'Bob', 'cdiuhcsadncjkdsanncjkdnask' +
    'cnadskjcndskcndkscnksanckcsn');
    expect(example1).toStrictEqual(400);
    expect(example2).toStrictEqual(400);
  });
});

// AUTHLOGIN
describe('login Correct Inputs', () => {
  test('testing correct return type with 1 registered', () => {
    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const example2 = login('abob@gmail.com', 'hello123');
    expect(example2).toStrictEqual({ token: expect.any(String), authUserId: 1000 });
    expect(example2.token).toStrictEqual(expect.any(String));
  });
  test('testing with multiple users', () => {
    register('abocmb@gmail.com', 'hello1231', 'Oobla', 'Larleypq');
    register('aebob@gmail.com', 'helvlo123', 'Ooba', 'Larlevdsay');
    register('abbob@gmail.com', 'hello123', 'Oobeq', 'Larlcsey');
    const example4 = login('abbob@gmail.com', 'hello123');
    expect(example4).toStrictEqual({ token: expect.any(String), authUserId: 1010 });
    expect(example4.token).toStrictEqual(expect.any(String));
  });
});
describe('login Invalid Inputs', () => {
  test('email entered does not belong to a user', () => {
    register('nLnx@gmail.com', 'hello123', 'Ooeecab', 'Lcamarley');
    register('coeanp@gmail.com', 'hello123', 'Oobocsp', 'Laredmaley');
    const example3 = login('abob@gmail.com', 'hello123');
    expect(example3).toStrictEqual(400);
  });

  test('password is not correct', () => {
    register('nabob@gmail.com', 'hello123', 'Oobl', 'Larleyp');
    const example2 = login('nabob@gmail.com', 'bobmarley');
    expect(example2).toStrictEqual(400);
  });

  // email is empty string
  test('email is empty string', () => {
    register('nabob@gmail.com', 'hello123', 'Oobl', 'Larleyp');
    const example2 = login('', 'bobmarley');
    expect(example2).toStrictEqual(400);
  });

  // password is empty string
  test('password is empty string', () => {
    register('nabob@gmail.com', 'hello123', 'Oobl', 'Larleyp');
    const example2 = login('nabob@gmail.com', '');
    expect(example2).toStrictEqual(400);
  });

  // both empty
  test('email is empty string', () => {
    register('nabob@gmail.com', 'hello123', 'Oobl', 'Larleyp');
    const example2 = login('', '');
    expect(example2).toStrictEqual(400);
  });
});

// AUTHLOGOUT
describe('logout Correct Inputs', () => {
  test('testing correct return type with 1 registered', () => {
    const user1 = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    expect(user1.authUserId).toStrictEqual(1000);
    expect(user1.token).toStrictEqual(expect.any(String));
    expect(logout(user1.token)).toStrictEqual({});
  });
  test('testing correct return type with multiple registered', () => {
    const user1 = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    register('abobe@gmail.com', 'hello123', 'Oob', 'Larley');
    const user3 = register('abobs@gmail.com', 'hello123', 'Oob', 'Larley');
    expect(user1.authUserId).toStrictEqual(1000);
    expect(user1.token).toStrictEqual(expect.any(String));
    expect(logout(user3.token)).toStrictEqual({});
  });
  test('testing correct return type with 1 registered multiple login', () => {
    const user1 = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const user2 = login('abob@gmail.com', 'hello123');
    const user3 = login('abob@gmail.com', 'hello123');
    expect(user1.authUserId).toStrictEqual(1000);
    expect(user1.token).toStrictEqual(expect.any(String));
    expect(logout(user3.token)).toStrictEqual({});
    expect(logout(user2.token)).toStrictEqual({});
    expect(logout(user1.token)).toStrictEqual({});
  });
});

describe('logout Invalid Inputs', () => {
  test('token is invalid', () => {
    const user1 = register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    expect(user1).toStrictEqual({ token: expect.any(String), authUserId: 1000 });
    expect(user1.token).toStrictEqual(expect.any(String));
    expect(logout({ token: 'hello' })).toStrictEqual(403);
  });
});

// AUTHPASSWORDRESETREQUEST
describe('authPasswordResetRequest Correct Inputs', () => {
  test('bad email should not throw an error', () => {
    clear();

    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    const passwordRequest = passwordResetRequest('adlsajlal@gmail.com');
    expect(passwordRequest).toStrictEqual({});
  });
  test('testing with 1 session', () => {
    clear();

    const user1 = register('abob@gmail.com', 'hello1231', 'Oobla', 'Larleypq');

    const passwordRequest = passwordResetRequest('abob@gmail.com');
    expect(passwordRequest).toStrictEqual({});
    expect(logout(user1.token)).toStrictEqual(403);
  });
  test('testing with 3 sessions', () => {
    clear();

    const user1 = register('abob@gmail.com', 'hello1231', 'Oobla', 'Larleypq');
    login('abob@gmail.com', 'hello1231');
    login('abob@gmail.com', 'hello1231');

    const passwordRequest = passwordResetRequest('abob@gmail.com');
    expect(passwordRequest).toStrictEqual({});
    expect(logout(user1.token)).toStrictEqual(403);
  });
});

// AUTHPASSWORDRESETRESET
describe('authPasswordResetReset Invalid Inputs', () => {
  test('new password is less than 6 characters length && invalid resetcode', () => {
    clear();

    register('abob@gmail.com', 'hello123', 'Oob', 'Larley');
    expect(passwordResetReset('dsljaldlakl', 'dsa')).toStrictEqual(400);
  });
});
