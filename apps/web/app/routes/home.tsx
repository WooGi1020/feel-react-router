import {
  Form,
  data,
  useNavigation,
  redirect,
  useActionData,
} from "react-router";
import type { Route } from "./+types/home";
import { getSessionData } from "~/services/auth.server";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken, toast, commitHeader } = await getSessionData(request);
  if (!accessToken) throw redirect("/login");

  const res = await fetch("http://localhost:5173/api/v1/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw redirect("/login");

  return data(
    { ...(await res.json()), toast },
    {
      headers: commitHeader ? { "Set-Cookie": commitHeader } : {},
    }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const { accessToken } = await getSessionData(request);
  if (!accessToken) throw redirect("/login");

  const formData = await request.formData();
  const res = await fetch("http://localhost:5173/api/v1/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res.ok) return { success: false, message: "수정 실패" };
  return { success: true, message: "성공적으로 업데이트되었습니다." };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { name, role, id } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    const message = actionData?.message;
    if (message) alert(message);
  }, [actionData]);

  return (
    <div className="w-full max-w-md shadow-xl p-8 m-auto bg-white rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">프로필 #{id}</h1>
      <Form method="POST" className="space-y-4">
        <input
          name="name"
          defaultValue={name}
          disabled={isSubmitting}
          className="w-full border-b p-2 outline-none focus:border-blue-600"
        />
        <input
          name="role"
          defaultValue={role}
          disabled={isSubmitting}
          className="w-full border-b p-2 outline-none focus:border-blue-600"
        />
        <button
          disabled={isSubmitting}
          className="w-full py-3 bg-black text-white rounded-xl disabled:bg-gray-400"
        >
          {isSubmitting ? "처리 중..." : "정보 수정"}
        </button>
      </Form>
    </div>
  );
}
