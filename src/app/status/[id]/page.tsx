"use client";

import { use, useEffect, useState } from "react";
import { useRequests } from "@/context/request-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Package, 
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Truck,
  MapPin,
  Calendar,
  Mail,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function RequestStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getRequestById } = useRequests();
  const request = getRequestById(id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id]);

  const copyTrackingLink = () => {
    if (request?.trackingLink) {
      navigator.clipboard.writeText(request.trackingLink);
      setCopied(true);
      toast.success("Tracking link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!request) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-none shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Request Not Found</CardTitle>
            <CardDescription>
              We couldn&apos;t find a request with ID <strong>{id}</strong>.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href="/status">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Another ID
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      title: "Under Review",
      description: "Your request has been received and is currently being reviewed by the brand. We'll notify you once a decision is made.",
      step: 1,
    },
    approved: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      title: "Approved 🎉",
      description: "Great news! Your sample request has been approved. Your product is being prepared for shipment.",
      step: 2,
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
      title: "Not Approved",
      description: "Unfortunately, your request was not approved at this time. Don't worry, you can apply for other products!",
      step: 2,
    },
  };

  const currentStatus = statusConfig[request.status];
  const Icon = currentStatus.icon;

  // Calculate estimated delivery (3-5 business days from approval)
  const getEstimatedDelivery = () => {
    if (request.status === "approved") {
      const approvedDate = new Date(request.createdAt);
      const deliveryDate = new Date(approvedDate);
      deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 days from approval
      return deliveryDate;
    }
    return null;
  };

  const estimatedDelivery = getEstimatedDelivery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Main Status Card */}
          <Card className="overflow-hidden border-none shadow-xl">
            <div className={cn(
              "h-2 w-full", 
              request.status === "approved" ? "bg-green-500" : 
              request.status === "rejected" ? "bg-red-500" : 
              "bg-amber-400"
            )} />
            <CardHeader className="text-center pb-6">
              <div className={cn(
                "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2",
                currentStatus.bgColor,
                currentStatus.borderColor,
                currentStatus.color
              )}>
                <Icon className="h-10 w-10" />
              </div>
              <CardTitle className="text-4xl font-bold mb-2">{currentStatus.title}</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                {currentStatus.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 sm:px-8">
              {/* Tracking Information for Approved Requests */}
              {request.status === "approved" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Shipment Tracking</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your sample is being prepared and will be shipped soon.
                        </p>
                        
                        {/* Tracking Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                            <Package className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-xs text-muted-foreground">Status</p>
                              <p className="font-semibold">
                                {request.shippingStatus === "label_created" && "Label Created"}
                                {request.shippingStatus === "preparing_shipment" && "Preparing Shipment"}
                                {request.shippingStatus === "in_transit" && "In Transit"}
                                {request.shippingStatus === "out_for_delivery" && "Out for Delivery"}
                                {request.shippingStatus === "delivered" && "Delivered"}
                                {!request.shippingStatus && "Label Created"}
                              </p>
                            </div>
                          </div>
                          {estimatedDelivery && (
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-xs text-muted-foreground">Est. Delivery</p>
                                <p className="font-semibold">
                                  {estimatedDelivery.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tracking Link */}
                        {request.trackingLink && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                              <p className="text-xs text-muted-foreground mb-1">Tracking Link</p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono text-foreground flex-1 truncate">
                                  {request.trackingLink}
                                </code>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={copyTrackingLink}
                                >
                                  {copied ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                              <Link href={request.trackingLink}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Full Details
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Timeline */}
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-card">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Shipping Timeline
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                          1
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-semibold">Order Confirmed</p>
                          <p className="text-sm text-muted-foreground">
                            Your request was approved and order confirmed
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                          2
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-semibold">Preparing for Shipment</p>
                          <p className="text-sm text-muted-foreground">
                            Your sample is being packaged and prepared
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold">
                          3
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-semibold text-muted-foreground">In Transit</p>
                          <p className="text-sm text-muted-foreground">
                            Your package will be shipped soon
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold">
                          4
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-semibold text-muted-foreground">Delivered</p>
                          <p className="text-sm text-muted-foreground">
                            Expected delivery: {estimatedDelivery?.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Summary */}
              <div className="rounded-lg bg-muted/50 p-6 border border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold mb-4">Request Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Request ID</p>
                    <p className="font-mono font-bold text-sm">{request.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product ID</p>
                    <Badge variant="outline" className="font-mono text-xs">
                      {request.productId}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Creator Name</p>
                    <p className="font-semibold">{request.creatorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="font-semibold text-sm">{request.email}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Channel Link</p>
                    <a 
                      href={request.channelLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-semibold text-accent hover:underline flex items-center gap-1.5 text-sm"
                    >
                      Visit Channel
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Request Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6">
                <div className="absolute left-[21px] top-2 h-[calc(100%-16px)] w-0.5 bg-border" />
                
                <div className="relative flex items-start gap-4">
                  <div className="z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-background bg-green-500 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold">Request Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      Your application was received by the brand.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={cn(
                    "z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-background",
                    request.status !== "pending" 
                      ? (request.status === "approved" 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white") 
                      : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  )}>
                    {request.status === "pending" ? (
                      <Clock className="h-5 w-5" />
                    ) : request.status === "approved" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold">Brand Decision</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.status === "pending" 
                        ? "Awaiting review from the brand team." 
                        : `The brand has ${request.status} your request.`}
                    </p>
                  </div>
                </div>

                {request.status === "approved" && (
                  <div className="relative flex items-start gap-4">
                    <div className="z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-background bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="pt-2 flex-1">
                      <h4 className="font-bold text-muted-foreground">Product Delivered</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive your sample and start creating amazing content!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
