import z from "zod";

export const CreateEmployeeSchema = z.object({
  age: z
    .number({ error: "Umur wajib diisi" })
    .min(18, "Umur minimal 18 tahun"),
  name: z
    .string({ error: "Nama wajib diisi" })
    .min(1, "Nama wajib diisi"),
  position: z
    .string({ error: "Posisi wajib diisi" })
    .min(1, "Posisi wajib diisi"),
  salary: z.number({ error: "Gaji wajib diisi" }),
});

export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
