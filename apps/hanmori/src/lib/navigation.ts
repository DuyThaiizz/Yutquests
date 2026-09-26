/** Match a section on path boundaries, including its alternate learning routes. */
export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  const roots = href === "/library" ? [href, "/topik"] : [href];
  return roots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}
