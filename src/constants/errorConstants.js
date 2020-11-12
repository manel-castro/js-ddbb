exports.errorConstants = {
  BAD_CREDENTIALS: { code: 401, message: "Bad credentials." },
  SOMETHING_GONE_WRONG: { code: 400, message: "Something gone wrong." },
  UNAUTHORIZED: { code: 401, message: "Unauthorized." },
  EMAIL_BADLY_FORMATTED: { code: 401, message: "Email badly formatted." },
  EMAIL_ALREADY_EXISTS: { code: 412, message: "Email already exists." },
  BODY_REQUEST_MISSING: { code: 412, message: "Body request is missing." },
  TOKEN_EXPIRED: { code: 401, message: "Token expired, log in again." },
  ID_ALREADY_EXISTS: { code: 400, message: "The id doesn't meet our criteria, left it empty to autogenerate it." }
};
