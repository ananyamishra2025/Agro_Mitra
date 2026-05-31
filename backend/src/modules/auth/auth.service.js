const users = [];

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  provider: user.provider,
  role: user.role,
  createdAt: user.createdAt,
});

const registerUser = ({ name, email, phone, password, provider = "email" }) => {
  if (!name || (!email && !phone)) {
    throw new Error("Name and email or phone are required");
  }

  const existingUser = users.find(
    (user) => (email && user.email === email) || (phone && user.phone === phone)
  );

  if (existingUser) {
    return publicUser(existingUser);
  }

  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    phone,
    password,
    provider,
    role: "Farmer / Student",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return publicUser(user);
};

const loginUser = ({ email, phone, password, provider = "email" }) => {
  if (provider === "google") {
    return registerUser({
      name: "Google User",
      email,
      provider: "google",
    });
  }

  const user = users.find(
    (entry) => (email && entry.email === email) || (phone && entry.phone === phone)
  );

  if (!user) {
    throw new Error("Account not found");
  }

  if (user.password && password && user.password !== password) {
    throw new Error("Invalid credentials");
  }

  return publicUser(user);
};

const getDemoUser = () => ({
  id: "demoUser",
  name: "Ananya Mishra",
  role: "Farmer / Student",
  provider: "demo",
});

module.exports = { getDemoUser, loginUser, registerUser };
