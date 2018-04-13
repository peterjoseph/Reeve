module.exports = {
  ROLE_TYPE: Object.freeze({
    UNREGISTERED: 0,
    ROOT: 1,
    ADMINISTRATOR: 2
  }),

  INVALID_SUBDOMAINS: Object.freeze([
    "account",
    "signup",
    "register",
    "login",
    "settings",
    "manage"
  ])
};
