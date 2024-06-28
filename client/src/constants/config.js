export const API_NOTIFICATION_MESSAGES = {
  loading: {
    title: "Loading...",
    message: "Data is being loaded. Please wait...",
  },
  success: {
    title: "Success",
    message: "Data successfully loaded.",
  },
  responseFailure: {
    title: "Error",
    message:
      "A error occured while fetching response from the server. PLease try again.",
  },
  requestFailure: {
    title: "Error",
    message: "An error occured while parsing request data",
  },

  networkError: {
    title: "Error",
    message:
      "Unable to connect with the server. Please check connectivity and try again later.",
  },
};

export const SERVICE_URLS = {
  userSignup: { url: "/auth/signup", method: "POST" },
  userSignin: { url: "/auth/signin", method: "POST" },
  forgotPassword: { url: "/auth/forgotPassword", method: "POST" },
  resetPassword: { url: "/auth/resetPassword", method: "POST" },
  verifyAuthentication: { url: "/auth/verify", method: "GET" },
  userLogout: { url: "/auth/logout", method: "GET" },
  getUserById: { url: "/user/details", method: "GET", query: true },
  updateProfile: { url: "/user/update", method: "PUT", query: true },
  uploadFile: { url: "/file/upload", method: "POST" },
  getAllUsers: { url: "/users", method: "GET" },

  //chats
  accessChat: { url: "/chat", method: "POST" },
  fetchChats: { url: "/chat/fetch", method: "GET" },
  createTeam: { url: "/team", method: "POST" },
  renameTeam: { url: "/team/rename", method: "PUT" },
  removeFromTeam: { url: "/team/remove", method: "PUT" },
  addToTeam: { url: "/team/add", method: "PUT" },

  //message
  sendMessage: { url: "/message/send", method: "POST" },
  getAllMessages: { url: "/message", method: "GET", query: true },
  uploadFileInMessage: { url: "/message/upload/file", method: "POST" },

  //tasks
  addTask: { url: "/tasks/add", method: "POST" },
  deleteTask: { url: "/tasks/delete", method: "DELETE", query: true },
  completeTask: { url: "/tasks/complete", method: "PUT", query: true },
  markImportant: { url: "/tasks/markImportant", method: "PUT" },
  getTasks: { url: "/tasks/getByFilter", method: "POST" },

  //notes
  addNote: { url: "/notes/add", method: "POST" },
  getAllNotes: { url: "/notes/get", method: "GET", query: true },
  markAsImportant: { url: "/notes/markImportant", method: "PUT", query: true },
  deleteNote: { url: "/notes/delete", method: "DELETE", query: true },

  //poll
  getPollById: { url: "/poll/get", method: "POST" },
  votePoll: { url: "/poll/vote", method: "POST" },
};
