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
 */
export function debug(namespace: string): (...args: any[]) => void {
  return (...args: any[]) => {
    if (enabledPattern && enabledPattern.test(namespace)) {
      console.log(`[${namespace}]`, ...args);
    }
  };
}
