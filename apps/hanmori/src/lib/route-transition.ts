export type RouteTransitionKind = "wave" | "breeze" | "ripple";

/** Give each destination a visual rhythm without changing navigation behavior. */
export function routeTransitionFor(pathname: string): RouteTransitionKind {
  if (pathname === "/" || /^\/(review|practice|notebook|progress)(\/|$)/.test(pathname)) {
    return "ripple";
  }
  if (/^\/(library|grammar|topik)(\/|$)/.test(pathname)) {
    return "wave";
  }
  return "breeze";
}
