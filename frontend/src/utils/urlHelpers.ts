/**
 * Ensures a URL has a proper protocol (https://)
 * @param url - The URL to normalize
 * @returns URL with protocol or empty string
 */
export function ensureProtocol(url: string | undefined): string {
    if (!url) return '';

    const trimmed = url.trim();
    if (!trimmed) return '';

    // If it already has a protocol, return as is
    if (trimmed.match(/^https?:\/\//i)) {
        return trimmed;
    }

    // If it starts with //, add https:
    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }

    // Otherwise, add https://
    return `https://${trimmed}`;
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL to validate
 * @returns true if valid URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(ensureProtocol(url));
        return true;
    } catch {
        return false;
    }
}
