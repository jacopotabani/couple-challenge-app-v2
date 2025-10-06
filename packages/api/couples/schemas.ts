import { z } from 'zod'

// Schema for couple member (embedded)
export const CoupleMemberSchema = z.object({
  user_ref: z.string(), // Will be ObjectId as string in API responses
  joined_at: z.date(),
  role: z.enum(['creator', 'member']).optional(),
})

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

// Schema for couple response (with embedded members)
export const CoupleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  couple_code: z.string(),
  created_at: z.date(),
  members: z.array(CoupleMemberSchema).optional(),
})

// Schema for detailed couple response (includes members)
export const DetailedCoupleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  couple_code: z.string(),
  created_by: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  members: z.array(CoupleMemberSchema),
})

// Schema for create couple API response
export const CreateCoupleApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  couple: CoupleResponseSchema,
})

// Schema for join couple API response
export const JoinCoupleApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  couple: DetailedCoupleResponseSchema,
})

// Schema for error response
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(z.any()).optional(),
})

// Inferred types from schemas
export type CoupleMember = z.infer<typeof CoupleMemberSchema>
export type CreateCoupleInput = z.infer<typeof CreateCoupleSchema>
export type JoinCoupleInput = z.infer<typeof JoinCoupleSchema>
export type CoupleResponse = z.infer<typeof CoupleResponseSchema>
export type DetailedCoupleResponse = z.infer<typeof DetailedCoupleResponseSchema>
export type CreateCoupleApiResponse = z.infer<typeof CreateCoupleApiResponseSchema>
export type JoinCoupleApiResponse = z.infer<typeof JoinCoupleApiResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
