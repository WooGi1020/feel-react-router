import { createCookieSessionStorage, redirect } from "react-router";

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createSession(request: Request, accessToken: string) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.set("accessToken", accessToken);

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}

export async function getAccessToken(request: Request) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return session.get("accessToken");
}

export async function logout(request: Request) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  throw redirect("/login", {
    headers: {
      "Set-Cookie": await authSessionStorage.destroySession(session),
    },
  });
}
