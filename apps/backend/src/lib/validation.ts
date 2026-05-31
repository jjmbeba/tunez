import { vValidator } from '@hono/valibot-validator'
import { fail } from './response.js'
import * as v from 'valibot'

type ValidationHook = NonNullable<Parameters<typeof vValidator>[2]>

function getValidationMessage(result: Parameters<ValidationHook>[0]): string {
  const issue = result.issues?.find(
    (entry) => typeof entry.message === 'string' && entry.message.trim().length > 0,
  )

  return issue?.message ?? 'Invalid request'
}

export const validationHook: ValidationHook = (result, c) => {
  if (!result.success) {
    return c.json(fail(getValidationMessage(result)), 400)
  }
}

export const trimmedRequiredString = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string`),
    v.trim(),
    v.nonEmpty(`${field} is required`),
  )

export const requiredUrlString = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string`),
    v.trim(),
    v.nonEmpty(`${field} is required`),
    v.url(`${field} must be a valid URL`),
  )

export const normalizedOptionalUrl = (field: string) =>
  v.pipe(
    v.optional(
      v.nullable(
        v.pipe(
          v.string(`${field} must be a string when provided`),
          v.trim(),
          v.transform((input) => (input === '' ? null : input)),
          v.nullable(v.pipe(v.string(), v.url(`${field} must be a valid URL`))),
        ),
      ),
    ),
    v.transform((input) => input ?? null),
  )

export const optionalIsoDate = (field: string) =>
  v.optional(
    v.pipe(
      v.string(`${field} must be a valid ISO date when provided`),
      v.trim(),
      v.transform((input) => (input === '' ? undefined : input)),
      v.optional(
        v.pipe(
          v.string(),
          v.isoTimestamp(`${field} must be a valid ISO date when provided`),
          v.toDate(`${field} must be a valid ISO date when provided`),
        ),
      ),
    ),
  )
