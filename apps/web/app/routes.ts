import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "./routes/login.tsx"),
  layout("./routes/layout.tsx", [
    index("routes/home.tsx"),
    route("logout", "./routes/logout.ts"),
  ]),
] satisfies RouteConfig;
