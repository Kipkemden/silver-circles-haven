
import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ForumPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    author: {
      name: string;
      avatar?: string;
    };
  };
  isPublic?: boolean;
}

const ForumPost = ({ post, isPublic = true }: ForumPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = () => {
    if (!isPublic) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="mb-6 border border-silver-200 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-silver-200">
              {post.author.avatar ? (
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-silver-800">{post.author.name}</h3>
              <div className="flex items-center text-silver-500 text-sm">
                <Clock size={14} className="mr-1" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {!isPublic && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <h2 className="text-xl font-medium mb-2 text-silver-900">{post.title}</h2>
        <p className="text-silver-700">{post.content}</p>
      </CardContent>
      <CardFooter
        className={cn(
          "border-t border-silver-100 py-3 flex justify-between",
          isPublic && "opacity-80"
        )}
      >
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleLike}
            disabled={isPublic}
            className={cn(
              "flex items-center space-x-1 text-silver-600 hover:text-primary transition-colors",
              isLiked && "text-primary",
              isPublic && "cursor-not-allowed"
            )}
          >
            <Heart size={18} className={isLiked ? "fill-primary" : ""} />
            <span>{likesCount}</span>
          </button>
          <div className="flex items-center space-x-1 text-silver-600">
            <MessageCircle size={18} />
            <span>{post.commentsCount}</span>
          </div>
        </div>
        
        {isPublic && (
          <div className="text-primary font-medium">
            Subscribe to join the conversation
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForumPost;
