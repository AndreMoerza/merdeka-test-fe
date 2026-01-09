"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "@bprogress/next";
import { ArrowLeft } from "lucide-react";

type AppHeadingProps = {
  title: string;
  description: string;
  className?: string;
  rightContent?: React.ReactNode;
  useBack?: boolean;
  onBackClick?: () => void;
};

export function AppHeading(props: AppHeadingProps) {
  const router = useRouter();

  const handleBack = () => {
    if (props?.onBackClick) {
      return props.onBackClick();
    }
    return router.back();
  };

  return (
    <div className={cn("flex items-center justify-between", props.className)}>
      <div className="flex items-center gap-4">
        {props.useBack && (
          <button onClick={handleBack} type="button" className="cursor-pointer">
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          <p className="text-gray-500">{props.description}</p>
        </div>
      </div>
      {props.rightContent}
    </div>
  );
}
