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
};
