import { Form, Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import { getAccessToken } from "~/services/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = await getAccessToken(request);

  // 1. 인증이 없는데 로그인 페이지가 아닌 곳에 접근하면 로그인으로 리다이렉트
  if (!token && url.pathname !== "/login") {
    throw redirect("/login");
  }

  return { isAuthenticated: !!token };
}

export default function layout() {
  return (
    <main className="min-h-screen pt-16 flex">
      <nav className="fixed inset-0 h-16 flex justify-between items-center px-10">
        <h1>My App</h1>
        <Form action="/logout" method="post">
          <button type="submit">로그아웃</button>
        </Form>
      </nav>
      <section className="container mx-auto grid flex-1">
        <Outlet />
      </section>
    </main>
  );
}
