export default {
  type: "object",
  required: [
    "PORT",
    "DB_URL",
    "ORIGIN",
    // "GOOGLE_CLIENT_ID",
    // "GOOGLE_CLIENT_SECRET",
    // "GOOGLE_CALLBACK_URL",
  ],
  properties: {
    PORT: { type: "string" },
    DB_URL: { type: "string" },
    ORIGIN: { type: "string" },
    GOOGLE_CLIENT_ID: { type: "string" },
    GOOGLE_CLIENT_SECRET: { type: "string" },
    GOOGLE_CALLBACK_URL: { type: "string" },
  },
};
