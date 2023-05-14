```javascript
let data = {
  users: [
    {
      userId: 2
      nameFirst: 'Billy',
      nameLast: 'John',
      email: 'duck@gmail.com',
      password: 'duck',
      handleStr: 'billyjohn',
    },
    {
      userId: 1
      nameFirst: 'Bob',
      nameLast: 'Jo',
      email: 'a@gmail.com',
      password: 'big',
      handleStr: 'bobjo',
    },
  ],
  channels: [
    {
      channelId: 4
      publicity: 'private',
      name: 'My Channel',
      ownerMembers: [1],
      allMembers: [1, 2],
      messages: {
        messageId: 1,
        authUserId: 1,
        message: 'hello',
        timeSent: 1234567891,
      },
    },
    {
      channelId: 3
      publicity: 'public',
      name: 'Pannel',
      ownerMembers: [2],
      allMembers: [1, 2],
      messages: {
        messageId: 2,
        authUserId: 2,
        message: 'goodbye',
        timeSent: 9876543211,
      },
    },
  ],
};
```

For the above designed data structure we decided to layer it as one big object
filled with many other objects which contain the data for users and channels.
By doing so it:
- Allows us to easily access all the stored data since it is all located
in one big structure/object rather than many smaller structures/objects.
- This allows for easy importation and exportation of stored data for
function use.
- By using one big structure/object as our data structure it allows us
to store both our data on users and channels in one place, making the data 
for them easy to locate and access.
- By having this one big structure/object it allows us to have channels and
users as keys within them, allowing us to store more variables/data within
them. 
- By using these keys to store more data, we use them to store more
objects in them where the keys for these objects are named/used to represent
the user and channel Id's. This allows us to more easily find and access the
information allocated with each Id by looking through the different Id values
rather than having to search through each piece of stored data to find what
Id values exist and what information associates with each Id value. 
- By doing so it allows us to store another object within the Id keys where
this obejct contains the data associated with this Id value, making it easy
to access and locate these different pieces of stored data/information for
each user and channel.


