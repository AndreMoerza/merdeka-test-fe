"use client";

import { FormInput, FormMoneyInput } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useKaryawanApi } from "@/lib/apis/employee/employee-hook";
import {
  CreateEmployee,
  CreateEmployeeSchema,
} from "@/lib/apis/employee/employee-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface EmployeeFormProps {
  item?: Karyawan;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function EmployeeForm({
  item,
  onRefresh,
  onClose,
}: EmployeeFormProps) {
  const { data: session } = useSession();

  const { useCreateEmployee, useUpdateEmployee } = useKaryawanApi();
  const { mutateAsync: createEmployee } = useCreateEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();

  const form = useForm<CreateEmployee>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      age: item?.age ?? undefined,
      name: item?.name ?? "",
      position: item?.position ?? "",
      salary: item?.salary ?? undefined,
    },
  });

  const {
    formState: { errors },
  } = form;

  const handleSubmit = async (data: CreateEmployee) => {
    const payload = item?.id ? { id: item.id, ...data } : { ...data };

    const [createdEmployee] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateEmployee(payload as CreateEmployee & { id: string });
        }
        return await createEmployee(payload);
      },
      (err) => {
        toast({
          title: "Gagal membuat karyawan",
          description:
            err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );

    if (createdEmployee) {
      toast({
        title: "Karyawan berhasil disimpan",
        description: "Karyawan baru telah berhasil dibuat dan disimpan.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.setValue("name", item.name);
      form.setValue("age", item.age);
      form.setValue("position", item.position);
      form.setValue("salary", Number(item.salary));
    }
  }, [item, form]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Nama */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInput
                label="Nama"
                placeholder="Masukkan nama karyawan"
                isRequired
                {...field}
              />
            )}
          />

          {/* Umur */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormInput
                label="Umur"
                inputMode="numeric"
                placeholder="Masukkan umur karyawan"
                isRequired
                value={field.value ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d*$/.test(v)) field.onChange(Number(v));
                }}
              />
            )}
          />

          {/* Posisi */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormInput
                label="Posisi"
                placeholder="Masukkan posisi karyawan"
                isRequired
                {...field}
              />
            )}
          />

          {/* Gaji */}
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormMoneyInput
                label="Gaji"
                placeholder="Masukkan gaji karyawan"
                isRequired
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
              />
            )}
          />

          <div className="flex flex-row items-center justify-end space-x-2 !mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Karyawan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
