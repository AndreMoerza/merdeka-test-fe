import { z } from "zod";

const idPhoneRegex = /^\+62\d{9,13}$/;

export const registerUserSchema = z.object({
  name: z.string({ message: "Nama harus diisi" }).min(1),
  email: z.email({ message: "Email tidak valid" }).min(1, "Email harus diisi"),
  phone: z.string().min(10, { message: "No. Telepon harus diisi" }).regex(idPhoneRegex, {
    message: "No. Telepon harus dengan format +62XXXXXXXXXX",
  }),
  password: z
    .string({ message: "Password harus diisi" })
    .min(6, "Password harus kurang lebih 8 karakter"),
  confirmPassword: z
    .string({ message: "Konfirmasi Password harus diisi" })
    .min(6, "Konfirmasi Password harus kurang lebih 8 karakter"),
  role: z.object().optional().default({}),
});
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.email({ message: "Email tidak valid" }).min(1, "Email harus diisi"),
  password: z
    .string({
      message: "Password harus diisi",
    })
    .min(6, "Password harus diisi"),
  deviceInfo: z.object({
    deviceName: z.string(),
    deviceType: z.string(),
    deviceOs: z.string(),
  }),
});
export type LoginUserSchema = z.infer<typeof loginUserSchema>;
