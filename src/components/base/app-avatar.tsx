import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AppAvatarProps {
  name: string;
  avatar?: string | null;
  className?: string;
}

export function AppAvatar({ name, avatar, className }: AppAvatarProps) {
  const nameParts = name.split(" ").slice(0, 2);
  const initials = nameParts
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className={cn("h-8 w-8 rounded-lg bg-gray-200", className)}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="rounded-lg bg-gray-200">{initials}</AvatarFallback>
    </Avatar>
  );
}
