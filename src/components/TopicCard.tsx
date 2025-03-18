
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor?: string;
  link: string;
  className?: string;
}

const TopicCard = ({
  title,
  description,
  icon,
  bgColor = "bg-blue-50",
  link,
  className,
}: TopicCardProps) => {
  return (
    <Link
      to={link}
      className={cn(
        "block group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:shadow-lg",
        bgColor,
        className
      )}
    >
      <div className="absolute top-6 right-6 opacity-10 transform scale-150 transition-transform duration-300 group-hover:scale-[1.75]">
        {icon}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl mb-3 font-serif font-medium">{title}</h3>
        <p className="text-silver-700 mb-6">{description}</p>
        
        <div className="flex items-center text-primary font-medium">
          <span>Learn more</span>
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
