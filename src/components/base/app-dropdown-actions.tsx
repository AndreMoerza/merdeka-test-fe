"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface AppDropdownActionsProps {
  align?: "center" | "end" | "start";
  menuItemChildren?: React.ReactNode;
  labelEdit?: string;
  labelDelete?: string;
  hideEdit?: boolean;
  hideDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AppDropdownActions = ({
  align = "end",
  menuItemChildren,
  labelEdit = "Edit",
  labelDelete = "Hapus",
  hideDelete,
  hideEdit,
  onEdit,
  onDelete,
}: AppDropdownActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {menuItemChildren}
        {!hideEdit && (
          <DropdownMenuItem className="flex cursor-pointer flex-row items-center" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-3" />
            <span className="text-sm">{labelEdit}</span>
          </DropdownMenuItem>
        )}
        {!hideDelete && menuItemChildren && <DropdownMenuSeparator />}
        {!hideDelete && (
          <DropdownMenuItem
            className="flex cursor-pointer flex-row items-center"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-3 text-destructive" />
            <span className="text-destructive">{labelDelete}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppDropdownActions;
