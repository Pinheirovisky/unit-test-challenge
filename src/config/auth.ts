export default {
  jwt: {
    secret: (process.env.NODE_ENV
      ? "senha_local"
      : process.env.JWT_SECRET) as string,
    expiresIn: "1d",
  },
};
