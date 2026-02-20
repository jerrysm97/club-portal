// lib/crypto.ts — CTF flag hashing (SHA-256)
// SECURITY: Only called server-side for flag comparison.
// NEVER expose this function or its output to the client.
import 'server-only'
import { createHash } from 'crypto'

/**
 * Hash a CTF flag using SHA-256.
 * Normalizes: trim whitespace, convert to lowercase.
 * This MUST match exactly how flag_hash is stored in the DB.
 *
 * @example
 * const isCorrect = hashFlag(submittedFlag) === challenge.flag_hash
 */
export function hashFlag(rawFlag: string): string {
    return createHash('sha256')
        .update(rawFlag.trim().toLowerCase())
        .digest('hex')
}
