import { Tender } from "@/lib/mock-data";
import { useTranslation } from '../lib/hooks/useTranslation';
import {
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type StatusType = "open" | "closed" | "pending";

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; label: string; color: string }
> = {
  open: {
    icon: CheckCircle,
    label: "Open",
    color: "border-green-200 text-green-700 bg-green-50",
  },
  closed: {
    icon: XCircle,
    label: "Closed",
    color: "border-red-200 text-red-700 bg-red-50",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "border-yellow-200 text-yellow-700 bg-yellow-50",
  },
};

const TenderCards = ({ tender }: { tender: Tender }) => {
    const { t } = useTranslation();

  const status = statusConfig[tender.status as StatusType];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {tender.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{t('business')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">1200$</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">34 applicants</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Due: {new Date(tender.deadline).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{tender.category}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </span>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200">
            <Eye className="h-3 w-3 mr-1" />
            {t('view')}
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition-colors duration-200">
            <Edit className="h-3 w-3 mr-1" />
            {t('edit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenderCards;
