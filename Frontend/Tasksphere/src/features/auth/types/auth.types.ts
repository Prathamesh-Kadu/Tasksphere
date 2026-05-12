import type z from "zod"
import type { loginSchema, registerSchema } from "../schema/auth.schema"


export type LoginRequest = z.infer<typeof loginSchema>
export type RegisterRequest = z.infer<typeof registerSchema>

export interface LoginResponse {
    id: string,
    name: string,
    email: string,
    role: string,
    token: string
}

export interface RegisterResponse {
    id: string,
    name: string,
    email: string
}