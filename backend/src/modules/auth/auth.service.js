const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("./user.model");
const AuthToken = require("./auth-token.model");
const { isDatabaseConnected } = require("../../utils/database");

const JWT_SECRET = () => process.env.JWT_SECRET || "agro-mitra-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

const memoryUsers = [];
const revokedTokens = new Set();
const resetTokens = new Map();

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const seedAdmin = () => {
  if (memoryUsers.some((user) => user.role === "admin")) return;

  memoryUsers.push({
    id: "admin_1",
    name: "Agro-Mitra Admin",
    email: "admin@agromitra.in",
    phone: "",
    passwordHash: bcrypt.hashSync("admin123", BCRYPT_ROUNDS),
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

const ensureAdminUser = async () => {
  if (!isDatabaseConnected()) return;

  const existingAdmin = await User.findOne({ role: "admin" }).select("+passwordHash");
  if (existingAdmin) return;

  await User.create({
    name: "Agro-Mitra Admin",
    email: "admin@agromitra.in",
    passwordHash: bcrypt.hashSync("admin123", BCRYPT_ROUNDS),
    provider: "email",
    role: "admin",
    status: "active",
    profile: {
      location: "Kolkata, West Bengal",
      farmType: "Platform Operations",
      preferredLanguage: "English",
    },
  });
};

const publicUser = (user) => ({
  id: user.id || user._id?.toString(),
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
      sub: user.id || user._id?.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET(),
    { expiresIn: JWT_EXPIRES_IN }
  );

const getTokenExpiryDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const rememberSession = async (user, token) => {
  if (!isDatabaseConnected()) return;

  await AuthToken.create({
    userId: user.id || user._id?.toString(),
    tokenHash: hashToken(token),
    purpose: "session",
    expiresAt: getTokenExpiryDate(),
  });
};

const authPayload = async (user) => {
  const token = issueToken(user);
  await rememberSession(user, token);
  return {
    user: publicUser(user),
    token,
  };
};

const findMemoryUserByIdentifier = ({ email, phone }) =>
  memoryUsers.find((user) => (email && user.email === email) || (phone && user.phone === phone));

const findMemoryUserById = (id) => memoryUsers.find((user) => user.id === id);

const findDbUserByIdentifier = ({ email, phone }, includePassword = false) => {
  if (!email && !phone) return null;

  const query = User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : []),
    ],
  });

  return includePassword ? query.select("+passwordHash") : query;
};

const registerUser = async ({ name, email, phone, password, provider = "email", role = "farmer" }) => {
  if (!name || (!email && !phone)) {
    throw new Error("Name and email or phone are required");
  }

  if (provider === "email" && !password) {
    throw new Error("Password is required");
  }

  if (isDatabaseConnected()) {
    await ensureAdminUser();
    const existingUser = await findDbUserByIdentifier({ email, phone });
    if (existingUser) return authPayload(existingUser);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password ? bcrypt.hashSync(password, BCRYPT_ROUNDS) : null,
      provider,
      role,
      status: "active",
      profile: {
        location: "",
        farmType: "",
        preferredLanguage: "English",
      },
    });

    return authPayload(user);
  }

  const existingUser = findMemoryUserByIdentifier({ email, phone });
  if (existingUser) return authPayload(existingUser);

  const now = new Date().toISOString();
  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    phone,
    passwordHash: password ? bcrypt.hashSync(password, BCRYPT_ROUNDS) : null,
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

  memoryUsers.push(user);
  return authPayload(user);
};

const loginUser = async ({ email, phone, password, provider = "email", name }) => {
  if (provider === "google") {
    return registerUser({
      name: name || "Google User",
      email,
      provider: "google",
      role: "farmer",
    });
  }

  const user = isDatabaseConnected()
    ? await findDbUserByIdentifier({ email, phone }, true)
    : findMemoryUserByIdentifier({ email, phone });

  if (!user) throw new Error("Account not found");
  if (user.status !== "active") throw new Error("Account is not active");
  if (!bcrypt.compareSync(password || "", user.passwordHash || "")) {
    throw new Error("Invalid credentials");
  }

  user.lastLoginAt = new Date();
  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

  return authPayload(user);
};

const logoutUser = async (token) => {
  if (token) revokedTokens.add(token);

  if (token && isDatabaseConnected()) {
    await AuthToken.findOneAndUpdate(
      { tokenHash: hashToken(token) },
      {
        purpose: "revoked",
        revokedAt: new Date(),
      }
    );
  }

  return { loggedOut: true };
};

const isTokenRevoked = async (token) => {
  if (revokedTokens.has(token)) return true;
  if (!isDatabaseConnected()) return false;

  const record = await AuthToken.findOne({
    tokenHash: hashToken(token),
    purpose: "revoked",
  });

  return Boolean(record);
};

const verifyToken = (token) => jwt.verify(token, JWT_SECRET());

const getProfile = async (userId) => {
  const user = isDatabaseConnected()
    ? await User.findById(userId)
    : findMemoryUserById(userId);

  if (!user) throw new Error("User not found");
  return publicUser(user);
};

const updateProfile = async (userId, payload) => {
  const user = isDatabaseConnected()
    ? await User.findById(userId)
    : findMemoryUserById(userId);

  if (!user) throw new Error("User not found");

  user.name = payload.name ?? user.name;
  user.phone = payload.phone ?? user.phone;
  user.profile = {
    ...(user.profile || {}),
    ...(payload.profile || {}),
  };

  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

  return publicUser(user);
};

const changePassword = async ({ userId, email, phone, currentPassword, newPassword }) => {
  if (!newPassword) throw new Error("New password is required");

  const user = userId
    ? isDatabaseConnected()
      ? await User.findById(userId).select("+passwordHash")
      : findMemoryUserById(userId)
    : isDatabaseConnected()
      ? await findDbUserByIdentifier({ email, phone }, true)
      : findMemoryUserByIdentifier({ email, phone });

  if (!user) throw new Error("Account not found");

  if (user.passwordHash && !bcrypt.compareSync(currentPassword || "", user.passwordHash)) {
    throw new Error("Current password is incorrect");
  }

  user.passwordHash = bcrypt.hashSync(newPassword, BCRYPT_ROUNDS);
  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

  return publicUser(user);
};

const createPasswordReset = async ({ email, phone }) => {
  const user = isDatabaseConnected()
    ? await findDbUserByIdentifier({ email, phone })
    : findMemoryUserByIdentifier({ email, phone });

  if (!user) throw new Error("Account not found");

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const userId = user.id || user._id?.toString();

  if (isDatabaseConnected()) {
    await AuthToken.create({
      userId,
      tokenHash: hashToken(token),
      purpose: "password_reset",
      expiresAt,
    });
  } else {
    resetTokens.set(token, {
      userId,
      expiresAt: expiresAt.getTime(),
    });
  }

  return {
    resetToken: token,
    expiresInMinutes: 15,
  };
};

const resetPassword = async ({ token, newPassword }) => {
  let userId;

  if (isDatabaseConnected()) {
    const reset = await AuthToken.findOne({
      tokenHash: hashToken(token),
      purpose: "password_reset",
      expiresAt: { $gt: new Date() },
    });

    if (!reset) throw new Error("Reset token is invalid or expired");
    userId = reset.userId;
    await reset.deleteOne();
  } else {
    const reset = resetTokens.get(token);
    if (!reset || reset.expiresAt < Date.now()) {
      throw new Error("Reset token is invalid or expired");
    }
    userId = reset.userId;
    resetTokens.delete(token);
  }

  const user = isDatabaseConnected()
    ? await User.findById(userId).select("+passwordHash")
    : findMemoryUserById(userId);

  if (!user) throw new Error("Account not found");

  user.passwordHash = bcrypt.hashSync(newPassword, BCRYPT_ROUNDS);
  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

  return publicUser(user);
};

const updateUserRole = async (userId, role) => {
  const user = isDatabaseConnected()
    ? await User.findById(userId)
    : findMemoryUserById(userId);

  if (!user) throw new Error("User not found");
  user.role = role;

  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

  return publicUser(user);
};

const listUsers = async () => {
  if (isDatabaseConnected()) {
    await ensureAdminUser();
    const users = await User.find().sort({ createdAt: 1 });
    return users.map(publicUser);
  }

  return memoryUsers.map(publicUser);
};

const updateUserStatus = async (userId, status) => {
  const user = isDatabaseConnected()
    ? await User.findById(userId)
    : findMemoryUserById(userId);

  if (!user) throw new Error("User not found");
  user.status = status;

  if (isDatabaseConnected()) {
    await user.save();
  } else {
    user.updatedAt = new Date().toISOString();
  }

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
