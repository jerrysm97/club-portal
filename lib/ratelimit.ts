// lib/ratelimit.ts — Upstash Redis rate limiters (CONTEXT.md §17)
import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/** Contact form: 3 submissions per hour per IP */
export const contactFormLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:contact',
})

/** CTF flag submission: 10 attempts per minute per member */
export const flagSubmitLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'rl:ctf',
})

/** Member registration: 5 attempts per hour per email */
export const registerLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'rl:register',
})

/** Magic link request: 3 requests per 15 minutes per email */
export const magicLinkLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '15 m'),
    prefix: 'rl:magiclink',
})
