import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    route("login", "./routes/login.tsx"),
    index("routes/home.tsx"),
    route("logout", "./routes/logout.ts"),
  ]),
] satisfies RouteConfig;
