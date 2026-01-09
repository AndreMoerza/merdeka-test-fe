import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

type IconButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: string;
  children: ReactNode;
};

export function IconButtonWithTooltip({
  tooltip,
  children,
  ...buttonProps
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="py-6 px-4 w-min"
          variant="outline"
          size="lg"
          {...buttonProps}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
