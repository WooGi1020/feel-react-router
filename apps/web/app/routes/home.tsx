import { Form, useActionData, useNavigation, redirect } from "react-router";
import type { Route } from "./+types/home";
import { getAccessToken } from "~/services/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) throw redirect("/login");

  const response = await fetch("http://localhost:5173/api/v1/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw redirect("/login");
  return await response.json();
}

export async function action({ request }: Route.ActionArgs) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) throw redirect("/login");

  const formData = await request.formData();
  const updatedData = Object.fromEntries(formData);

  const response = await fetch("http://localhost:5173/api/v1/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) return { success: false, message: "수정에 실패했습니다." };

  const data = await response.json();
  return { success: true, message: "성공적으로 업데이트되었습니다.", data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { name, role, id } = loaderData;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="w-full max-w-md rounded-2xl shadow-xl p-8 m-auto bg-white relative">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
          <p className="text-sm text-gray-500">계정 고유번호: #{id}</p>
        </div>
      </div>

      <Form className="space-y-6" method="POST">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            이름
          </label>
          <input
            name="name"
            defaultValue={name}
            disabled={isSubmitting}
            className="text-lg font-medium border-b border-gray-200 text-gray-800 pl-0.5 focus:border-blue-600 outline-none transition-colors disabled:bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            역할
          </label>
          <input
            name="role"
            defaultValue={role}
            disabled={isSubmitting}
            className="text-lg font-medium border-b border-gray-200 text-gray-800 pl-0.5 focus:border-blue-600 outline-none transition-colors disabled:bg-gray-50"
          />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? "수정 중..." : "정보 수정하기"}
        </button>
      </Form>
    </div>
  );
}
