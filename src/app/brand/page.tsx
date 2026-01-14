"use client";

import { useState, useMemo } from "react";
import { useRequests, RequestStatus, ShippingStatus } from "@/context/request-context";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Search,
  MoreHorizontal,
  Clock,
  TrendingUp,
  Users,
  Package,
  Calendar,
  Mail,
  Globe,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function BrandDashboard() {
  const { requests, updateRequestStatus, updateShippingStatus } = useRequests();
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesFilter = filter === "all" || req.status === filter;
      const matchesSearch = 
        req.creatorName.toLowerCase().includes(search.toLowerCase()) || 
        req.email.toLowerCase().includes(search.toLowerCase()) ||
        req.id.toLowerCase().includes(search.toLowerCase()) ||
        req.productId.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [requests, filter, search]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "pending").length;
    const approved = requests.filter(r => r.status === "approved").length;
    const rejected = requests.filter(r => r.status === "rejected").length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0";

    return { total, pending, approved, rejected, approvalRate };
  }, [requests]);

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      await updateRequestStatus(id, "approved");
      toast.success("Request approved! Tracking link generated.", {
        description: "The creator will be notified.",
      });
    } catch (error) {
      console.error("Failed to approve request:", error);
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(id);
    try {
      await updateRequestStatus(id, "rejected");
      toast.error("Request rejected.", {
        description: "The creator has been notified.",
      });
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleAdvanceShipping = async (id: string, current?: ShippingStatus | null) => {
    // Simple finite state machine for shipping progression
    const order: ShippingStatus[] = [
      "label_created",
      "preparing_shipment",
      "in_transit",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = current ? order.indexOf(current) : 0;
    const next = order[Math.min(currentIndex + 1, order.length - 1)];

    if (!next || next === current) return;

    setLoading(id);
    try {
      await updateShippingStatus(id, next);
      toast.success("Shipping status updated", {
        description: `New status: ${next.replace(/_/g, " ")}`,
      });
    } catch (error) {
      console.error("Failed to update shipping status:", error);
      toast.error("Failed to update shipping status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Brand Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage and review sample requests from creators
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
                <p className="text-xs text-muted-foreground mt-1">Samples sent</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
                <p className="text-xs text-muted-foreground mt-1">Not eligible</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.approvalRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Success rate</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, ID, or product..." 
                  className="pl-9 h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={filter === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(s)}
                    className={`whitespace-nowrap ${
                      filter === s 
                        ? "shadow-sm" 
                        : ""
                    }`}
                  >
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    {s !== "all" && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                        {s === "pending" ? stats.pending : s === "approved" ? stats.approved : stats.rejected}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sample Requests
            </CardTitle>
            <CardDescription>
              {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[140px]">Request ID</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead className="hidden sm:table-cell">Product</TableHead>
                    <TableHead className="hidden md:table-cell">Channel</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                          <div className="text-muted-foreground">
                            <p className="font-medium">No requests found</p>
                            <p className="text-sm mt-1">
                              {search || filter !== "all" 
                                ? "Try adjusting your search or filters" 
                                : "No sample requests yet"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow 
                        key={req.id} 
                        className="group transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="font-medium font-mono text-xs">
                          {req.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold">{req.creatorName}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{req.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="font-mono text-xs">
                            {req.productId}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <a 
                            href={req.channelLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-accent hover:underline group/link"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">Visit Channel</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(req.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(req.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {req.status === "pending" ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300"
                                  onClick={() => handleApprove(req.id)}
                                  disabled={loading === req.id}
                                >
                                  {loading === req.id ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                  )}
                                  <span className="hidden sm:inline">Approve</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                                  onClick={() => handleReject(req.id)}
                                  disabled={loading === req.id}
                                >
                                  {loading === req.id ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <XCircle className="mr-2 h-3.5 w-3.5" />
                                  )}
                                  <span className="hidden sm:inline">Reject</span>
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                  {req.trackingLink && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      asChild
                                      className="h-8"
                                    >
                                      <Link 
                                        href={req.trackingLink}
                                        className="flex items-center gap-1.5"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Track</span>
                                      </Link>
                                    </Button>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(req.id)}>
                                        Copy Request ID
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(req.email)}>
                                        Copy Email
                                      </DropdownMenuItem>
                                      {req.status === "approved" && (
                                        <DropdownMenuItem
                                          onClick={() => handleAdvanceShipping(req.id, req.shippingStatus ?? null)}
                                        >
                                          Advance Shipping Status
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                {req.status === "approved" && (
                                  <span className="text-[11px] text-muted-foreground">
                                    Shipping:{" "}
                                    <span className="font-medium">
                                      {req.shippingStatus
                                        ? req.shippingStatus.replace(/_/g, " ")
                                        : "label created"}
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
