import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authRegisterV3, authLoginV3, authLogoutV2, authPasswordResetRequestV1, authPasswordResetResetV1 } from './auth';
import { dmCreateV2, dmListV2, dmRemoveV2, dmDetailsV2, dmLeaveV2, messageSendDmV2, dmMessagesV2, messageSendLaterDmV1 } from './dm';
import { clearV1 } from './other';
import { userProfileV3, userListAllV2, userSetNameV2, userSetEmailV2, userSetHandleV2, adminUserRemoveV1, adminUserPermissionChangeV1, userStatsV1, usersStatsV1, uploadPhotoV1 } from './users';
import { channelAddOwnerV2, channelJoinV3, channelDetailsV3, channelLeaveV2, channelRemoveOwnerV2, channelInviteV3, channelMessagesV3 } from './channel';
import { channelsCreateV3, channelsListV3, channelsListAllV3 } from './channels';
import { messageSendV2, messageRemoveV2, messageEditV2, messageReactV1, messageUnreactV1, messageShareV1, notificationsV1, searchV1, messagePinV1, messageUnpinV1, messageSendLaterV1 } from './messages';
import { getData } from './dataStore';
import { standupStartV1, standupActiveV1, standupSendV1 } from './standUp';
import fs from 'fs';
import errorHandler from 'middleware-http-errors';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// use for storing images
app.use('/static', express.static('static'));

// for logging errors (print to terminal)
app.use(morgan('dev'));
// handles errors nicely
app.use(errorHandler());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

let data = getData();

if (fs.existsSync('./dataStore.json')) {
  const dataStoreString = fs.readFileSync('./dataStore.json');
  data = JSON.parse(String(dataStoreString));
  const dataClone = data;
  JSON.stringify(dataClone);
}

const save = () => {
  const jsonStr = JSON.stringify(data);
  fs.writeFileSync('./dataStore.json', jsonStr);
};

// channelMessagesV2 server HTTP implementation.
app.get('/channel/messages/v3', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;
  const result = channelMessagesV3(token, parseInt(channelId), parseInt(start));
  return res.json(result);
});

// messageSendV2 server HTTP implementation.
app.post('/message/send/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.body.channelId as string;
    const message = req.body.message as string;
    const result = messageSendV2(token, parseInt(channelId), message);
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// channelInviteV2 server HTTP implementation.
app.post('/channel/invite/v3', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const channelId = req.body.channelId;
  const uId = req.body.uId;
  const result = channelInviteV3(token, parseInt(channelId), parseInt(uId));
  save();
  return res.json(result);
});

// authLoginV3 server HTTP implementation.
app.post('/auth/login/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    const retValues = authLoginV3(email, password);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// searchV1 server HTTP implementation.
app.get('/search/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const queryStr = req.query.queryStr as string;
    const retValues = searchV1(token as string, queryStr);
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// authRegisterV3 server HTTP implementation.
app.post('/auth/register/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const retValues = authRegisterV3(email, password, nameFirst, nameLast);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// authLogoutV1 server HTTP implementation.
app.post('/auth/logout/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValues = authLogoutV2(token);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// authpasswordresetrequestv1 server http implementation
app.post('/auth/passwordreset/request/v1', (req: Request, res: Response, next) => {
  try {
    const email = req.body.email;
    const retValues = authPasswordResetRequestV1(email);
    save();
    return res.json(retValues);
  } catch (err) {
  }
});

// authpasswordresetresetv1 server http implementation
app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response, next) => {
  try {
    const resetCode = req.body.resetCode;
    const newPassword = req.body.newPassword;
    const retValues = authPasswordResetResetV1(resetCode, newPassword);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// clearV1 server HTTP implementation.
app.delete('/clear/v1', (req: Request, res: Response, next) => {
  const val = clearV1();
  save();
  return res.json(val);
});

// dmCreateV1 server HTTP implementation.
app.post('/dm/create/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { uIds } = req.body;
    const retValues = dmCreateV2(token, uIds);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// dmDetailsV1 server HTTP implementation.
app.get('/dm/details/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;
    const retValues = dmDetailsV2(token, parseInt(dmId));
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// dmListV1 server HTTP implementation.
app.get('/dm/list/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValues = dmListV2(token);
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// dmRemoveV1 server HTTP implementation.
app.delete('/dm/remove/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;
    const retValues = dmRemoveV2(token, parseInt(dmId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channeldetailsv2 server HTTP implementation.
app.get('/channel/details/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    const retValues = channelDetailsV3(token, parseInt(channelId));
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channelcreatev2 server HTTP implementation.
app.post('/channels/create/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { name, isPublic } = req.body;
    const retValues = channelsCreateV3(token, name, isPublic);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channeljoinv2 server HTTP implementation.
app.post('/channel/join/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    const retValues = channelJoinV3(token, parseInt(channelId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channeladdowner server HTTP implementation.
app.post('/channel/addowner/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    const retValues = channelAddOwnerV2(token, channelId, uId);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// usersall server HTTP implementation.
app.get('/users/all/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const users = userListAllV2((token));
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// userprofilesetname server HTTP implementation.
app.put('/user/profile/setname/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { nameFirst, nameLast } = req.body;
    const retValue = userSetNameV2(token, nameFirst, nameLast);
    save();
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

// userprofilesetemail server HTTP implementation.
app.put('/user/profile/setemail/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { email } = req.body;
    const retValue = userSetEmailV2(token, email);
    save();
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

// dmleave server HTTP implementation.
app.post('/dm/leave/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.body.dmId;
    const retValues = dmLeaveV2(token, parseInt(dmId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// dmMessagesV2 server HTTP implementation.
app.get('/dm/messages/v2', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;
  const result = dmMessagesV2(token, parseInt(dmId), parseInt(start));
  return res.json(result);
});

app.post('/message/senddm/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { dmId, message } = req.body;
    const retValues = messageSendDmV2(token, parseInt(dmId), message);
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// message react
app.post('/message/react/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    const retValues = messageReactV1(token, parseInt(messageId), parseInt(reactId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// message unreact
app.post('/message/unreact/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    const retValues = messageUnreactV1(token, parseInt(messageId), parseInt(reactId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// message share
app.post('/message/share/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const ogMessageId = req.body.ogMessageId;
    const message = req.body.message;
    const channelId = req.body.channelId;
    const dmId = req.body.dmId;
    const retValues = messageShareV1(token, parseInt(ogMessageId), message, parseInt(channelId), parseInt(dmId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channellist server HTTP implementation.
app.get('/channels/list/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValues = channelsListV3(token);
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channellistall server HTTP implementation.
app.get('/channels/listall/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValues = channelsListAllV3(token);
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// userprofile server HTTP implementation.
app.get('/user/profile/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { uId } = req.query;
    const retValues = userProfileV3(token as string, parseInt(uId as string));
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// userprofilesethandle server HTTP implementation.
app.put('/user/profile/sethandle/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { handleStr } = req.body;
    const retValue = userSetHandleV2(token, handleStr);
    save();
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

// messagePinV1 server HTTP implementation.
app.post('/message/pin/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const messageId = req.body.messageId as string;
    const result = messagePinV1(token, parseInt(messageId));
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// userprofilephoto server HTTP implementation
app.post('/user/profile/uploadphoto/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body;
    const retValues = uploadPhotoV1(token, imgUrl, parseInt(xStart), parseInt(yStart), parseInt(xEnd), parseInt(yEnd));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channelremoveowner server HTTP implementation.
app.post('/channel/removeowner/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    const retValues = channelRemoveOwnerV2(token, parseInt(channelId), parseInt(uId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// channelleave server HTTP implementation.
app.post('/channel/leave/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    const retValues = channelLeaveV2(token, parseInt(channelId));
    save();
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// messageeditV1 server HTTP implementation
app.put('/message/edit/v2', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const messageId = req.body.messageId;
  const message = req.body.message;
  const result = messageEditV2(token, parseInt(messageId), message);
  save();
  return res.json(result);
});

// messageRemoveV2 server HTTP implementation
app.delete('/message/remove/v2', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const messageId = req.query.messageId as string;
  const result = messageRemoveV2(token, parseInt(messageId));
  save();
  return res.json(result);
});

app.delete('/admin/user/remove/v1', (req: Request, res: Response, next) => {
  try {
    const uId = req.query.uId as string;
    const token = req.header('token');
    const retValue = adminUserRemoveV1(token as string, parseInt(uId));
    save();
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

app.post('/admin/userpermission/change/v1', (req: Request, res: Response, next) => {
  try {
    const { uId, permissionId } = req.body;
    const token = req.header('token');
    const retValue = adminUserPermissionChangeV1(token as string, parseInt(uId), parseInt(permissionId));
    save();
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

app.get('/users/stats/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValue = usersStatsV1(token as string);
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});

app.get('/user/stats/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValue = userStatsV1(token as string);
    return res.json(retValue);
  } catch (err) {
    next(err);
  }
});
// notificationsV1 server HTTP implementation.
app.get('/notifications/get/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const retValues = notificationsV1(token);
    return res.json(retValues);
  } catch (err) {
    next(err);
  }
});

// messageUnpinV1 server HTTP implementation.
app.post('/message/unpin/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const messageId = req.body.messageId as string;
    const result = messageUnpinV1(token, parseInt(messageId));
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// standupStartV1 server HTTP implementation.
app.post('/standup/start/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.body.channelId as string;
    const length = req.body.length as string;
    const result = standupStartV1(token, parseInt(channelId), parseInt(length));
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// standupSendV1 server HTTP implementation.
app.post('/standup/send/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.body.channelId as string;
    const message = req.body.message as string;
    const result = standupSendV1(token, parseInt(channelId), message);
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// standupActiveV1 server HTTP implementation.
app.get('/standup/active/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    const result = standupActiveV1(token, parseInt(channelId));
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// messageSendLaterV1 server HTTP implementation
app.post('/message/sendlater/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.body.channelId as string;
    const message = req.body.message as string;
    const timeSent = req.body.timeSent as string;
    const result = messageSendLaterV1(token, parseInt(channelId), message, parseInt(timeSent));
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// messageSendLaterDmV1 server HTTP implementation
app.post('/message/sendlaterdm/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.body.dmId as string;
    const message = req.body.message as string;
    const timeSent = req.body.timeSent as string;
    const result = messageSendLaterDmV1(token, parseInt(dmId), message, parseInt(timeSent));
    save();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
