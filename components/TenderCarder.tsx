import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Users,
  Calendar,
  DollarSign,
  Building,
  Eye,
} from "lucide-react";

interface Tender {
  id: string;
  title: string;
  category: string;
  price: string;
  postedDate: string;
  status: "Active" | "Closed" | "Draft";
  applicants: number;
  type: string;
}

interface TenderCardProps {
  tender: Tender;
}

export function TenderCarder({ tender }: TenderCardProps) {
  const { t } = useTranslation();
  const getStatusVariant = (status: Tender["status"]) => {
    switch (status) {
      case "Active":
        return "default"; // Default is usually blue/primary
      case "Closed":
        return "destructive"; // Red
      case "Draft":
        return "outline"; // Grey/outline
      default:
        return "secondary";
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {tender.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('open_menu')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
              <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500">{tender.category}</p>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-gray-700">
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
          <span>{tender.price}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <span>Posted: {tender.postedDate}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 text-gray-500" />
          <span>{tender.applicants} applicants</span>
        </div>
        <div className="flex items-center">
          <Building className="mr-2 h-4 w-4 text-gray-500" />
          <span>{tender.type}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4">
        <Badge variant={getStatusVariant(tender.status)} className="capitalize">
          {tender.status}
        </Badge>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" /> {t("view")}
        </Button>
      </CardFooter>
    </Card>
  );
}
