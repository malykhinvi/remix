import jsesc from "jsesc";

export function createServerHandoffString(serverHandoff: any): string {
  // Use jsesc to escape data returned from the loaders. This string is
  // inserted directly into the HTML in the `<Scripts>` element.
  serverHandoff.routeData = Object.entries(serverHandoff.routeData).reduce(
    (p, [k, v]) => {
      if (!(v instanceof Promise)) {
        p[k] = v;
      } else {
        p[k] = "$$PROMISE$$";
      }
      return p;
    },
    {} as Record<string, unknown>
  );
  return jsesc(serverHandoff, {
    isScriptContext: true
  });
}
