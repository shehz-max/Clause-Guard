import { z } from 'zod';

// File validation
export const uploadFileSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .refine(
      (name) => /\.(pdf|docx|doc)$/i.test(name),
      'Only PDF and DOCX files are supported'
    ),
  fileType: z.enum(['pdf', 'docx', 'doc']),
  fileSize: z.number()
    .max(50 * 1024 * 1024, 'File size must be less than 50MB')
});

// Contract ID validation
export const contractIdSchema = z.string().uuid('Invalid contract ID');

// Chat message validation
export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message too long (max 10000 characters)'),
  documentId: z.string().uuid('Invalid document ID')
});

// Array of chat messages
export const chatMessagesSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(10000)
  })).max(50, 'Maximum 50 messages allowed')
});

// Analyze request validation
export const analyzeRequestSchema = z.object({
  documentId: z.string().uuid('Invalid document ID')
});

// Knowledge base sync validation
export const kbSyncSchema = z.object({
  action: z.enum(['sync', 'refresh']).optional()
});

// Response schemas
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown().optional(),
  message: z.string().optional()
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional()
});

// Validation helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Type exports
export type UploadFile = z.infer<typeof uploadFileSchema>;
export type ContractId = z.infer<typeof contractIdSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessages = z.infer<typeof chatMessagesSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;