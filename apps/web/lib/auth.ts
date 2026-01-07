import { $, SHA256 } from "bun";

async function createUser(username: string, password: string) {
  if (await doesUserExist()) {
    return false;
  }
  const hashedPassword = new SHA256().update(password).digest("hex");
  const userJson = JSON.stringify({ username, password: hashedPassword });
  await $`echo ${userJson} >> u.json`;
  return true;
}

async function authenticateUser(username: string, password: string) {
  const userFile = await Bun.file("u.json").text();
  const user = JSON.parse(userFile);
  const hashedPassword = new SHA256().update(password).digest("hex");
  return user.username === username && user.password === hashedPassword;
}

async function doesUserExist() {
  const userFile = await Bun.file("u.json").text();
  return userFile.length > 0;
}

export { createUser, authenticateUser };
