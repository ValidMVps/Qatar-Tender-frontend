"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Download,
  Eye,
  Wallet,
  CreditCard,
  Banknote,
  Receipt,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Gavel,
  FileText,
} from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import {
  getMyPayments,
  getPaymentDetails,
} from "@/app/services/paymentService";
import { useAuth } from "@/context/AuthContext";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Types
interface Payment {
  _id: string;
  user: string;
  tender?: {
    _id: string;
    title: string;
  };
  bid?: {
    _id: string;
    amount: number;
  };
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentDetails: {
    card_brand?: string;
    card_last4?: string;
    charge_id?: string;
    error_code?: string;
    error_message?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PaymentHistoryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Load user payments
  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPayments();
    }
  }, [user]);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      matchesSearch =
        payment.transactionId.toLowerCase().includes(term) ||
        payment.tender?.title?.toLowerCase().includes(term) ||
        payment.status.includes(term);
    }

    let matchesStatus = true;
    if (selectedStatus !== "all") {
      matchesStatus = payment.status === selectedStatus;
    }

    let matchesType = true;
    if (selectedType !== "all") {
      if (selectedType === "tender-fee") {
        matchesType = !!payment.tender;
      } else if (selectedType === "bid-fee") {
        matchesType = !!payment.bid;
      }
    }

    let matchesPeriod = true;
    if (selectedPeriod !== "all") {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const diffInMonths =
        (now.getFullYear() - paymentDate.getFullYear()) * 12 +
        (now.getMonth() - paymentDate.getMonth());

      switch (selectedPeriod) {
        case "last-month":
          matchesPeriod = diffInMonths <= 1;
          break;
        case "last-3-months":
          matchesPeriod = diffInMonths <= 3;
          break;
        case "last-6-months":
          matchesPeriod = diffInMonths <= 6;
          break;
        case "last-year":
          matchesPeriod = diffInMonths <= 12;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPeriod;
  });

  // Get unique statuses for filter
  const statuses = ["all", ...new Set(payments.map((p) => p.status))];
  const types = ["all", "tender-fee", "bid-fee"];
  const periods = [
    "all",
    "last-month",
    "last-3-months",
    "last-6-months",
    "last-year",
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-QA", {
      style: "currency",
      currency: "QAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get badge color based on payment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 py-2 gap-2";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 py-2 gap-2";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 py-2 gap-2";
      case "refunded":
        return "bg-blue-50 text-blue-700 border-blue-200 py-2 gap-2";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 py-2 gap-2";
    }
  };

  // Get payment type icon
  const getPaymentIcon = (method: string) => {
    if (method === "tap_gateway" || method === "credit_card") {
      return <CreditCard className="h-5 w-5 " />;
    } else if (method === "bank_transfer") {
      return <Banknote className="h-5 w-5 text-green-500" />;
    } else if (method === "wallet") {
      return <Wallet className="h-5 w-5 text-purple-500" />;
    } else {
      return <Receipt className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get payment type label
  const getPaymentType = (payment: Payment) => {
    if (payment.tender) {
      return "Tender Fee";
    } else if (payment.bid) {
      return "Bid Fee";
    } else {
      return "Other";
    }
  };

  // Handle viewing payment details
  const handleViewDetails = async (paymentId: string) => {
    try {
      const payment = await getPaymentDetails(paymentId);
      setSelectedPayment(payment);
      setShowDetailsModal(true);
    } catch (err: any) {
      console.error("Error fetching payment details:", err);
      setError("Failed to load payment details");
    }
  };

  // Get total amount for display
  const getTotalAmount = () => {
    return filteredPayments.reduce((total, payment) => {
      return payment.status === "completed" ? total + payment.amount : total;
    }, 0);
  };

  // Payment Details Modal
  const PaymentDetailsModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {t("payment_details")}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetailsModal(false)}
                className="hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6">
              <div>
                <div className="flex items-center mb-2">
                  {getPaymentIcon(selectedPayment.paymentMethod)}
                  <span className="ml-2 font-medium text-gray-900">
                    {selectedPayment.paymentMethod === "tap_gateway"
                      ? "Tap Payments"
                      : selectedPayment.paymentMethod === "credit_card"
                      ? "Credit Card"
                      : selectedPayment.paymentMethod === "bank_transfer"
                      ? "Bank Transfer"
                      : selectedPayment.paymentMethod === "wallet"
                      ? "Wallet"
                      : "Other"}
                  </span>
                </div>
                <Badge
                  className={`text-xs font-medium rounded-lg ${getStatusColor(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status.charAt(0).toUpperCase() +
                    selectedPayment.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right md:text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(selectedPayment.amount)}
                </div>
                <div className="text-sm text-gray-500">
                  {getPaymentType(selectedPayment)} •{" "}
                  {selectedPayment.transactionId}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t("payment_information")}
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("transaction_id")}
                      </span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("payment_method")}
                      </span>
                      <span className="font-medium text-gray-900 capitalize">
                        {selectedPayment.paymentMethod.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("payment_status")}
                      </span>
                      <Badge
                        className={`capitalize px-2 py-1 text-xs ${getStatusColor(
                          selectedPayment.status
                        )}`}
                      >
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("amount")}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPayment.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t("dates")}
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {t("created")}
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatDate(selectedPayment.createdAt)}
                        </div>
                      </div>
                    </div>
                    {selectedPayment.updatedAt !==
                      selectedPayment.createdAt && (
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {t("updated")}
                          </div>
                          <div className="font-medium text-gray-900">
                            {formatDate(selectedPayment.updatedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Related Items */}
              {(selectedPayment.tender || selectedPayment.bid) && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t("related_items")}
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    {selectedPayment.tender && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {selectedPayment.tender.title}
                            </div>
                            <div className="text-sm text-gray-500">Tender</div>
                          </div>
                        </div>
                        <Link
                          href={`/business-dashboard/tender-details/${selectedPayment.tender._id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("view")}
                          </Button>
                        </Link>
                      </div>
                    )}
                    {selectedPayment.bid && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Gavel className="h-5 w-5 text-purple-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {t("bid")} #
                              {selectedPayment.bid._id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Bid Amount:{" "}
                              {formatCurrency(selectedPayment.bid.amount)}
                            </div>
                          </div>
                        </div>
                        <Link href={`/business-dashboard/my-bids`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("view")}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Method Details */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {t("payment_method_details")}
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedPayment.paymentMethod === "tap_gateway" && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("card_brand")}</span>
                        <span className="font-medium text-gray-900">
                          {selectedPayment.paymentDetails.card_brand || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("card_number")}
                        </span>
                        <span className="font-medium text-gray-900">
                          ****{" "}
                          {selectedPayment.paymentDetails.card_last4 || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("charge_id")}</span>
                        <span className="font-medium text-gray-900">
                          {selectedPayment.paymentDetails.charge_id || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPayment.paymentMethod === "bank_transfer" && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("bank_name")}</span>
                        <span className="font-medium text-gray-900">
                          Qatar National Bank
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("account_number")}
                        </span>
                        <span className="font-medium text-gray-900">
                          QBKXXXXXX
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("reference_number")}
                        </span>
                        <span className="font-medium text-gray-900">
                          {selectedPayment.transactionId}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPayment.paymentMethod === "wallet" && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("wallet_balance")}
                        </span>
                        <span className="font-medium text-gray-900">
                          Available in profile
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPayment.paymentMethod === "credit_card" && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("card_brand")}</span>
                        <span className="font-medium text-gray-900">
                          {selectedPayment.paymentDetails.card_brand || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("card_number")}
                        </span>
                        <span className="font-medium text-gray-900">
                          ****{" "}
                          {selectedPayment.paymentDetails.card_last4 || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Details */}
              {selectedPayment.status === "failed" &&
                selectedPayment.paymentDetails?.error_code && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-semibold text-red-800 mb-2">
                      {t("payment_failed")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-red-600">{t("error_code")}</span>
                        <span className="font-medium text-red-800">
                          {selectedPayment.paymentDetails.error_code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">
                          {t("error_message")}
                        </span>
                        <span className="font-medium text-red-800">
                          {selectedPayment.paymentDetails.error_message}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <PageTransitionWrapper>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </PageTransitionWrapper>
    );
  }

  if (error) {
    return (
      <PageTransitionWrapper>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Payments
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={loadPayments}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </PageTransitionWrapper>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="container mx-auto px-4 sm:px-6 lg:px-2 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-blue-800">
                  {t("total_spent")}
                </CardTitle>
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {formatCurrency(getTotalAmount())}
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {
                  filteredPayments.filter((p) => p.status === "completed")
                    .length
                }{" "}
                {t("successful_transactions")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-800">
                  {t("successful_payments")}
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {payments.filter((p) => p.status === "completed").length}
              </div>
              <p className="text-sm text-green-700 mt-1">
                {t("of_total_payments")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-red-800">
                  {t("failed_payments")}
                </CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                {payments.filter((p) => p.status === "failed").length}
              </div>
              <p className="text-sm text-red-700 mt-1">
                {t("please_retry_failed_payments")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t("search_payments_by_transaction_or_amount")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 border-0 bg-gray-50/80 shadow-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48 h-12 border-0 bg-gray-50/80 shadow-none rounded-xl">
                <SelectValue placeholder={t("filter_by_status")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                <SelectItem value="all">{t("all_statuses")}</SelectItem>
                {statuses.slice(1).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48 h-12 border-0 bg-gray-50/80 shadow-none rounded-xl">
                <SelectValue placeholder={t("filter_by_type")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                <SelectItem value="all">{t("all_types")}</SelectItem>
                <SelectItem value="tender-fee">{t("tender_fees")}</SelectItem>
                <SelectItem value="bid-fee">{t("bid_fees")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full lg:w-48 h-12 border-0 bg-gray-50/80 shadow-none rounded-xl">
                <SelectValue placeholder={t("filter_by_period")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                <SelectItem value="all">{t("all_time")}</SelectItem>
                <SelectItem value="last-month">{t("last_month")}</SelectItem>
                <SelectItem value="last-3-months">
                  {t("last_3_months")}
                </SelectItem>
                <SelectItem value="last-6-months">
                  {t("last_6_months")}
                </SelectItem>
                <SelectItem value="last-year">{t("last_year")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payments Table */}
        <Card className="bg-white border-0 shadow-sm">

          <CardContent>
            {filteredPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="font-semibold text-gray-700">
                      {t("date")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      {t("description")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      {t("amount")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      {t("status")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      {t("payment_method")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment._id}
                      className="border-none hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4">
                        {formatDate(payment.createdAt)}
                      </TableCell>

                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.tender &&
                              `${t("tender_fee")}: ${payment.tender.title}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.transactionId}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </TableCell>

                      <TableCell className="py-4">
                        <Badge
                          className={`text-xs border rounded-lg font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getPaymentIcon(payment.paymentMethod)}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center text-gray-600">
                          {getPaymentIcon(payment.paymentMethod)}
                          <span className="ml-2 capitalize">
                            {payment.paymentMethod.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("no_payments_found")}
                </h3>
                <p className="text-gray-600">
                  {t("you_have_no_payment_records")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        {showDetailsModal && selectedPayment && <PaymentDetailsModal />}
      </div>
    </PageTransitionWrapper>
  );
}
