function hashString(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function getAnonymousShareId(slug: string): string {
  return `pkt-${hashString(`carousel:${slug}`)}`;
}

export function getAnonymousRolePath(slug: string): string {
  return `/r/${getAnonymousShareId(slug)}`;
}

export function getAnonymousPacketBasePath(slug: string): string {
  return `/packets/${getAnonymousShareId(slug)}`;
}
