import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().or(z.date()).optional(),
  paymentMethod: z.enum(['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other']).optional(),
  notes: z.string().optional(),
});

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

export const recurringSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().or(z.date()).optional(),
  active: z.boolean().optional(),
});

export const updateSettingsSchema = z.object({
  name: z.string().min(2).optional(),
  currency: z.string().optional(),
  avatar: z.string().optional(),
  preferences: z
    .object({
      dateFormat: z.string().optional(),
      language: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});
