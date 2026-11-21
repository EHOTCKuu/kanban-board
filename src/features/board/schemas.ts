import { z } from 'zod';
import { COAT_KEYS } from './coats';

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Название не может быть пустым')
    .max(100, 'Название слишком длинное'),
  // Проверяем, что переданный окрас есть в нашем списке
  coat: z.enum(COAT_KEYS as [string, ...string[]]),
});

// Автоматически выводим TypeScript-тип из схемы
export type TaskFormValues = z.infer<typeof taskSchema>;