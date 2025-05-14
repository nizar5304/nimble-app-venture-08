
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, change, icon, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${change.positive ? "text-green-500" : "text-red-500"}`}>
                {change.positive ? "↑" : "↓"} {change.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full bg-[#c2446e]/10 dark:bg-[#c2446e]/20 flex items-center justify-center text-[#c2446e]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
