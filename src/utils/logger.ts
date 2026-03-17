/**
 * Lightweight logger with namespace filtering, replacing the `debug` npm package.
 *
 * Supports glob-style enable patterns (e.g. "squatch-js*" enables all namespaces
 * starting with "squatch-js"). When disabled, logger calls are effectively no-ops.
 */

let enabledPattern: RegExp | null = null;

/**
 * Enable logging for namespaces matching a glob pattern.
 * Supports `*` as a wildcard (e.g. "squatch-js*" or "squatch-js:widget").
 */
export function enableDebug(pattern: string): void {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const regex = escaped.replace(/\*/g, ".*");
  enabledPattern = new RegExp(`^${regex}$`);
}

/**
 * Disable all logging.
 */
export function disableDebug(): void {
  enabledPattern = null;
}

/**
 * Create a namespaced logger function.
 * Returns a function that logs to console when the namespace is enabled.
 * The returned function also has an `enabled` property for checking status.
 */
export function debug(
  namespace: string
): ((...args: any[]) => void) & { enabled: boolean } {
  const logFn = (...args: any[]) => {
    if (enabledPattern && enabledPattern.test(namespace)) {
      console.log(`[${namespace}]`, ...args);
    }
  };
  Object.defineProperty(logFn, "enabled", {
    get() {
      return !!(enabledPattern && enabledPattern.test(namespace));
    },
  });
  return logFn as ((...args: any[]) => void) & { enabled: boolean };
}
