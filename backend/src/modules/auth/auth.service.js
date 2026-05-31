const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = () => process.env.JWT_SECRET || "agro-mitra-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const users = [];
const revokedTokens = new Set();
const resetTokens = new Map();

const seedAdmin = () => {
  if (users.some((user) => user.role === "admin")) return;

  users.push({
    id: "admin_1",
    name: "Agro-Mitra Admin",
    email: "admin@agromitra.in",
    phone: "",
    passwordHash: bcrypt.hashSync("admin123", 10),
    provider: "email",
    role: "admin",
    status: "active",
    profile: {
      location: "Kolkata, West Bengal",
      farmType: "Platform Operations",
      preferredLanguage: "English",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

seedAdmin();

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  provider: user.provider,
  role: user.role,
  status: user.status,
  profile: user.profile || {},
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const issueToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET(),
    { expiresIn: JWT_EXPIRES_IN }
  );

const authPayload = (user) => ({
  user: publicUser(user),
  token: issueToken(user),
});

const findUserByIdentifier = ({ email, phone }) =>
  users.find((user) => (email && user.email === email) || (phone && user.phone === phone));

const findUserById = (id) => users.find((user) => user.id === id);

const registerUser = ({ name, email, phone, password, provider = "email", role = "farmer" }) => {
  if (!name || (!email && !phone)) {
    throw new Error("Name and email or phone are required");
  }

  if (provider === "email" && !password) {
    throw new Error("Password is required");
  }

  const existingUser = findUserByIdentifier({ email, phone });
  if (existingUser) {
    return authPayload(existingUser);
  }

  const now = new Date().toISOString();
  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    phone,
    passwordHash: password ? bcrypt.hashSync(password, 10) : null,
    provider,
    role,
    status: "active",
    profile: {
      location: "",
      farmType: "",
      preferredLanguage: "English",
    },
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  return authPayload(user);
};

const loginUser = ({ email, phone, password, provider = "email", name }) => {
  if (provider === "google") {
    return registerUser({
      name: name || "Google User",
      email,
      provider: "google",
      role: "farmer",
    });
  }

  const user = findUserByIdentifier({ email, phone });
  if (!user) {
    throw new Error("Account not found");
  }

  if (user.status !== "active") {
    throw new Error("Account is not active");
  }

  if (!bcrypt.compareSync(password || "", user.passwordHash || "")) {
    throw new Error("Invalid credentials");
  }

  return authPayload(user);
};

const logoutUser = (token) => {
  if (token) revokedTokens.add(token);
  return { loggedOut: true };
};

const isTokenRevoked = (token) => revokedTokens.has(token);

const verifyToken = (token) => jwt.verify(token, JWT_SECRET());

const getProfile = (userId) => {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");
  return publicUser(user);
};

const updateProfile = (userId, payload) => {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");

  user.name = payload.name ?? user.name;
  user.phone = payload.phone ?? user.phone;
  user.profile = {
    ...(user.profile || {}),
    ...(payload.profile || {}),
  };
  user.updatedAt = new Date().toISOString();

  return publicUser(user);
};

const changePassword = ({ userId, email, phone, currentPassword, newPassword }) => {
  if (!newPassword) {
    throw new Error("New password is required");
  }

  const user = userId ? findUserById(userId) : findUserByIdentifier({ email, phone });
  if (!user) {
    throw new Error("Account not found");
  }

  if (user.passwordHash && !bcrypt.compareSync(currentPassword || "", user.passwordHash)) {
    throw new Error("Current password is incorrect");
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();
  return publicUser(user);
};

const createPasswordReset = ({ email, phone }) => {
  const user = findUserByIdentifier({ email, phone });
  if (!user) {
    throw new Error("Account not found");
  }

  const token = crypto.randomBytes(24).toString("hex");
  resetTokens.set(token, {
    userId: user.id,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return {
    resetToken: token,
    expiresInMinutes: 15,
  };
};

const resetPassword = ({ token, newPassword }) => {
  const reset = resetTokens.get(token);
  if (!reset || reset.expiresAt < Date.now()) {
    throw new Error("Reset token is invalid or expired");
  }

  const user = findUserById(reset.userId);
  if (!user) {
    throw new Error("Account not found");
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();
  resetTokens.delete(token);
  return publicUser(user);
};

const updateUserRole = (userId, role) => {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");
  user.role = role;
  user.updatedAt = new Date().toISOString();
  return publicUser(user);
};

const listUsers = () => users.map(publicUser);

const updateUserStatus = (userId, status) => {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");
  user.status = status;
  user.updatedAt = new Date().toISOString();
  return publicUser(user);
};

const getDemoUser = () => ({
  id: "demoUser",
  name: "Ananya Mishra",
  role: "Farmer / Student",
  provider: "demo",
});

module.exports = {
  changePassword,
  createPasswordReset,
  getDemoUser,
  getProfile,
  isTokenRevoked,
  listUsers,
  loginUser,
  logoutUser,
  publicUser,
  registerUser,
  resetPassword,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  verifyToken,
};
