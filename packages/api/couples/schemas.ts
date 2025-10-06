import { z } from 'zod'

// Schema for validating couple creation request
export const CreateCoupleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Couple name is required' })
    .max(100, { message: 'Couple name must be less than 100 characters' }),
})

// Schema for validating couple joining request
export const JoinCoupleSchema = z.object({
  couple_code: z
    .string()
    .length(6, { message: 'Couple code must be exactly 6 characters' })
    .regex(/^[A-Z0-9]+$/, {
      message: 'Couple code must contain only uppercase letters and numbers',
    }),
})

// Schema for couple response
export const CoupleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  couple_code: z.string(),
  created_at: z.date(),
})

// Schema for create couple API response
export const CreateCoupleApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  couple: CoupleResponseSchema,
})

// Schema for error response
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(z.any()).optional(),
})

// Inferred types from schemas
export type CreateCoupleInput = z.infer<typeof CreateCoupleSchema>
export type JoinCoupleInput = z.infer<typeof JoinCoupleSchema>
export type CoupleResponse = z.infer<typeof CoupleResponseSchema>
export type CreateCoupleApiResponse = z.infer<typeof CreateCoupleApiResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
