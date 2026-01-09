"use client";

import { cn } from "@/lib/utils";
import { formatThousandSeparator, normalizeBackendValue } from "@/lib/utils/money";
import { useEffect, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FlexibleSelect, FlexibleSelectProps } from "./app-select";

type FormInputProps = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormInput({
  label,
  isRequired,
  placeholder,
  type = "text",
  ...props
}: FormInputProps) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {isRequired && <span className="text-red-500 -ml-1.5">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input type={type} placeholder={placeholder} {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

type FormTextAreaProps = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextArea({
  label,
  isRequired,
  placeholder,
  rows = 3,
  ...props
}: FormTextAreaProps) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {isRequired && <span className="text-red-500 -ml-1.5">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Textarea rows={rows} placeholder={placeholder} {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

type FormMoneyInputProps = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormMoneyInput({
  label,
  isRequired,
  placeholder,
  value,
  onChange,
  ...props
}: FormMoneyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      setDisplayValue("0");
    } else {
      const normalized = normalizeBackendValue(String(value));
      setDisplayValue(formatThousandSeparator(normalized));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatThousandSeparator(e.target.value);
    setDisplayValue(formatted);

    const raw = formatted.replace(/\./g, "").replace(",", ".");
    const fakeEvent = {
      ...e,
      target: {
        ...e.target,
        value: raw,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(fakeEvent);
  };

  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {isRequired && <span className="text-red-500 -ml-1.5">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input value={displayValue} placeholder={placeholder} onChange={handleChange} {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

type FormSelectInputProps = FlexibleSelectProps & {
  label?: string;
  isRequired?: boolean;
  errorMsg?: string;
};

export function FormSelectInput({
  label,
  isRequired,
  className,
  errorMsg,
  value,
  ...props
}: FormSelectInputProps) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {isRequired && <span className="text-red-500 -ml-1.5">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <FlexibleSelect
          value={value}
          className={cn("w-full", errorMsg && "ring-destructive/20 border-destructive", className)}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
