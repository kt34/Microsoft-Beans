// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  Users: [],
  Channels: [],
  Dms: [],
  WorkSpace: {
    channelsExist: [],
    dmsExist: [],
    messagesExist: []
  }
};

// Use get() to access the data
export function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export function setData(newData) {
  data = newData;
}
