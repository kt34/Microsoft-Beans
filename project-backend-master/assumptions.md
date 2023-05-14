Iteration One - Assumptions

- For channelMessagesV1 it is assumed that when the number for start is negative an error is returned
 since you can't have a negative number of messages.

- It is assumed that all owners are channel members but not all channel members are owners. This is 
because members cannot have the same permissions as the channel owners.

- It is assumed that when people are added to a channel they are added as members, not as owners to 
ensure that they do not have the same permissions as the channel owner.

- The person who makes the channel is an owner of it, but everyone else that joins is a member. This 
ensures that the roles/permissions of the owners and members are rigidly defined.

- The first individual to sign up to Beans becomes a Global owner as well as a Global member meaning they 
will be permitted to join all channels regardless of the channel status (Public or Private). However, 
only the first EVER member is allowed to become a Global owner.

- The authUserId and channelId that are issued must be explicitly unique and cannot be the same. This is to 
ensure that no parameters clash so that the wrong data structure member is not incorrectly accessed to 
cause any conflicts. 


Iteration Two - Assumptions

- For user/profile/sethandle/v1 route it is assumed that when the user whises to change their handle and
calls this route their handle can now contain capital letters, whereas when the auth/register/v2 only 
creates a handle with all lowercase letters.

- For the tokens it is assumed that they are stored as an array of objects containing the sessionId. However
tokens are returned from the auth/register/v2 route as a string.

- When the channel/removeowner/v1 route is called and the owner of the channel is removed it is assumed that
users are still able to join a channel regardless of whether or not the channel has an owner.

- When the dm/messages/v1 route is called it is assumed that when the number for start is negative an error
is returned since as it is not possible to have a negative number of messages.

- When the dm/leave/v1 route is called it is assumed that when a user is made to leave, that the other user
remaining in the DM is still able to send messages.

- When a user handle or email or name is changed it will update not only in the user profile but across all
fields of data that it is already in e.g. channels or dms as well.

- When the message/remove/v1 route is called it is assumed that message is removed for all users in a channel
or Dm not just the user who called the user.

Iteration Three - Assumptions

- For message/react/v1 route it is assumed that users are able to react to their own messages

- For message/sendlaterdm/v1 route it is assumed that if the dm is removed and the message isn't sent a 
messageId will not be returned.

- For standup/start/v1 it is assumed that only the message sent by the user that started the standup is 
considered a message, while all messages that made up the compiled message are not treated as messages. 
As such only, the final message sent is included in user stats and workspace stats.

- For admin/user/remove/v1 route, it is assumed that if a user sends a message which is then pinned and 
reacted to by other users, the message will remain even after it is unpinned and remains reacted to.

- For admin/user/remove/v1 route, it is assumed that if a user calls the 'messageSendLater' route to send 
a message after a certain amount of time, but then that user's account is permanently deleted, it can be
 assumed that the content of the message will contain 'removed user'.

- For standup/start/v1 it is assumed that if an @ is sent to a standup, the user will not be notified. 