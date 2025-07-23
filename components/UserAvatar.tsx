import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name?: string;
    profileURL?: string;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({ user, size = "md", className = "" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-16 h-16",
    xl: "w-[120px] h-[120px]"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl", 
    xl: "text-4xl"
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={user.profileURL} 
        alt={user.name} 
        className="object-cover"
      />
      <AvatarFallback className={`${textSizes[size]} font-semibold bg-primary/10 text-primary`}>
        {user.name?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
