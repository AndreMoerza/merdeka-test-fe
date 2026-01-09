import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

import { cn } from "@/lib/utils";

export type ChildrenProps<T> = { children: ReactNode } & T;

const Flex = ({ children, className }: ChildrenProps<{ className?: ClassNameValue }>) => {
  return <div className={cn(`flex`, className)}>{children}</div>;
};
Flex.displayName = "Flex";

const FlexCol = ({
  children,
  className,
  spacing = 2,
}: ChildrenProps<{
  className?: ClassNameValue;
  spacing?: 0 | 1 | 2 | 4 | 8 | 10;
}>) => {
  const getY = (spacing: number) => {
    switch (spacing) {
      case 0:
        return "space-y-0";
      case 1:
        return "space-y-1";
      case 2:
        return "space-y-2";
      case 4:
        return "space-y-4";
      case 8:
        return "space-y-8";
      case 10:
        return "space-y-10";
      default:
        return "space-y-2";
    }
  };
  return <Flex className={cn(`flex-col`, getY(spacing), className)}>{children}</Flex>;
};
FlexCol.displayName = "FlexCol";

const FlexRow = ({
  children,
  className,
  spacing = 2,
  responsive = true,
  center = false,
}: ChildrenProps<{
  className?: ClassNameValue;
  spacing?: 2 | 4 | 8 | 10;
  responsive?: boolean;
  center?: boolean;
}>) => {
  const getX = (spacing: number) => {
    switch (spacing) {
      case 2:
        return "space-x-2";
      case 4:
        return "space-x-4";
      case 8:
        return "space-x-8";
      case 10:
        return "space-x-10";
      default:
        return "space-x-2";
    }
  };

  return (
    <Flex
      className={cn(
        `flex-row`,
        getX(spacing),
        responsive && `flex-col md:flex-row`,
        center && `items-center`,
        className,
      )}
    >
      {children}
    </Flex>
  );
};
FlexRow.displayName = "FlexRow";

export { Flex, FlexCol, FlexRow };
