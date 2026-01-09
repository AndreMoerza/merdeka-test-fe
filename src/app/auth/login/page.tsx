"use client";

import { FormInput } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { loginUserSchema, LoginUserSchema } from "@/lib/apis/auth/auth-schema";
import { getDeviceInfo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function AuthAdminPage() {
  const [loading, setLoading] = useState(false);

  const deviceInfo = getDeviceInfo();

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
      deviceInfo,
    },
  });

  const handleLogin = async (data: LoginUserSchema) => {
    setLoading(true);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      deviceInfo: JSON.stringify(data.deviceInfo),
      callbackUrl: "/dashboard",
      redirect: true,
    });
    setLoading(false);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Merdeka Admin</CardTitle>
        <CardDescription>Masukkan email dan password untuk akses Merdeka Admin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} ref={formRef} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput label="Email" placeholder="Masukkan email" isRequired {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  type="password"
                  label="Password"
                  placeholder="Masukkan password"
                  isRequired
                  {...field}
                />
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() =>
            formRef.current?.dispatchEvent?.(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
          }
          type="button"
          isLoading={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AuthAdminPage;
