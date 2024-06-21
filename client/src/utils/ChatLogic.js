export const getSender = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  }
  return null;
};

export const getSenderUsername = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id
      ? users[1].username
      : users[0].username;
  }
  return null;
};

export const getSenderImage = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id ? users[1].image : users[0].image;
  }
  return null;
};

export const getSenderId = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
  }
  return null;
};

export const getSenderProfession = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id
      ? users[1].profession
      : users[0].profession;
  }
  return null;
};

export const getSenderEmail = (loggedUser, users) => {
  if (users && users.length > 1) {
    return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
  }
  return null;
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== userId
  );
};

export const isFirstMessage = (messages, i) => {
  return (
    i === 0 || (i > 0 && messages[i - 1].sender._id !== messages[i].sender._id)
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i, userId) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
