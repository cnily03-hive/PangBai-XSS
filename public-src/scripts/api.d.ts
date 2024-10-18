export interface ErrorResponse {
    error: string
}

export interface SendResponse {
    id: string
}

export interface LetterResponse {
    title: string
    content: string
}

export interface CallResponse {
    success: boolean
    visit: string
    message?: string
    error?: string
}