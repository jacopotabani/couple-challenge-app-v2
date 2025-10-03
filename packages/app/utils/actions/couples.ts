import { z } from 'zod'

// Types and Schemas
export const CreateCoupleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Couple name is required' })
    .max(100, { message: 'Couple name must be less than 100 characters' }),
})

export const CoupleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  couple_code: z.string(),
  created_at: z.string().or(z.date()),
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  couple: CoupleResponseSchema,
})

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(z.any()).optional(),
})

// Types
export type CreateCoupleInput = z.infer<typeof CreateCoupleSchema>
export type CoupleResponse = z.infer<typeof CoupleResponseSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// Base API configuration
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser - use relative URL
    return ''
  }

  // Server-side or development
  return process.env.BETTER_AUTH_URL || 'http://localhost:3000'
}

const API_BASE_URL = getBaseUrl()

// Custom error class for API errors
export class CoupleApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any[]
  ) {
    super(message)
    this.name = 'CoupleApiError'
  }
}

// Utility function to make authenticated API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      // Try to parse error response
      const errorValidation = ErrorResponseSchema.safeParse(data)
      if (errorValidation.success) {
        throw new CoupleApiError(
          errorValidation.data.error,
          response.status,
          errorValidation.data.details
        )
      }

      // Fallback error
      throw new CoupleApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof CoupleApiError) {
      throw error
    }

    // Network or other errors
    throw new CoupleApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0
    )
  }
}

/**
 * Create a new couple
 * @param input - Couple creation data
 * @returns Promise with the created couple data
 */
export async function createCouple(input: CreateCoupleInput): Promise<CoupleResponse> {
  // Validate input
  const validationResult = CreateCoupleSchema.safeParse(input)
  if (!validationResult.success) {
    throw new CoupleApiError('Invalid input data', 400, validationResult.error.issues)
  }

  const response = await apiCall<ApiResponse>('/api/couples/create', {
    method: 'POST',
    body: JSON.stringify(validationResult.data),
  })

  // Validate response
  const responseValidation = ApiResponseSchema.safeParse(response)
  if (!responseValidation.success) {
    throw new CoupleApiError('Invalid response format', 500)
  }

  return responseValidation.data.couple
}

/**
 * Hook-style function for creating couples with loading state
 * This can be used in React components for better UX
 */
export function useCreateCouple() {
  return {
    createCouple: async (input: CreateCoupleInput) => {
      try {
        const result = await createCouple(input)
        return { success: true, data: result, error: null }
      } catch (error) {
        if (error instanceof CoupleApiError) {
          return {
            success: false,
            data: null,
            error: {
              message: error.message,
              status: error.status,
              details: error.details,
            },
          }
        }
        return {
          success: false,
          data: null,
          error: {
            message: 'An unexpected error occurred',
            status: 0,
            details: undefined,
          },
        }
      }
    },
  }
}

/**
 * Utility function to check if user is authenticated
 * This can be used before making couple-related API calls
 */
export async function checkAuthentication(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Future: Get couple by ID
 * This is a placeholder for when you add a GET endpoint
 */
export async function getCoupleById(id: string): Promise<CoupleResponse> {
  // This would be implemented when you add the GET endpoint
  throw new Error('getCoupleById not yet implemented - add GET endpoint first')
}

/**
 * Future: Get user's couples
 * This is a placeholder for when you add a user couples endpoint
 */
export async function getUserCouples(): Promise<CoupleResponse[]> {
  // This would be implemented when you add the user couples endpoint
  throw new Error('getUserCouples not yet implemented - add user couples endpoint first')
}

/**
 * Future: Join couple by code
 * This is a placeholder for when you add a join endpoint
 */
export async function joinCoupleByCode(code: string): Promise<CoupleResponse> {
  // This would be implemented when you add the join endpoint
  throw new Error('joinCoupleByCode not yet implemented - add join endpoint first')
}
