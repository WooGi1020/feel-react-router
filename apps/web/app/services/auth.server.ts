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
  session.flash("toast", "성공적으로 로그인되었습니다.");

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}

export async function redirectWithFlash(
  request: Request,
  url: string,
  message: string
) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.flash("toast", message);
  return redirect(url, {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}

export async function getSessionData(request: Request) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const toast = session.get("toast");
  const accessToken = session.get("accessToken");

  return {
    accessToken,
    toast,
    commitHeader: toast
      ? await authSessionStorage.commitSession(session)
      : null,
  };
}

export async function logout(request: Request) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.unset("accessToken");
  session.flash("toast", "성공적으로 로그아웃되었습니다.");
  throw redirect("/login", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}
