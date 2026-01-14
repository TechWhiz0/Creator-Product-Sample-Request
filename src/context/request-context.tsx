"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type RequestStatus = "pending" | "approved" | "rejected";

// Additional tracking-related statuses for shipping progress
export type ShippingStatus =
  | "label_created"
  | "preparing_shipment"
  | "in_transit"
  | "out_for_delivery"
  | "delivered";

export interface SampleRequest {
  id: string;
  creatorName: string;
  email: string;
  channelLink: string;
  productId: string;
  status: RequestStatus;
  trackingLink: string | null;

  // Tracking fields (optional so older documents still work)
  trackingNumber?: string | null;
  carrier?: string | null;
  shippingStatus?: ShippingStatus | null;

  createdAt: string;
}

interface RequestContextType {
  requests: SampleRequest[];
  addRequest: (request: Omit<SampleRequest, "id" | "status" | "trackingLink" | "createdAt">) => Promise<SampleRequest>;
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  updateShippingStatus: (id: string, shippingStatus: ShippingStatus) => Promise<void>;
  getRequestById: (id: string) => SampleRequest | undefined;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

const MOCK_REQUESTS: SampleRequest[] = [
  {
    id: "REQ-1001",
    creatorName: "Anshu",
    email: "anshu@email.com",
    channelLink: "https://youtube.com/@anshu",
    productId: "PROD-001",
    status: "pending",
    trackingLink: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1002",
    creatorName: "Sarah Chen",
    email: "sarah@creator.io",
    channelLink: "https://instagram.com/sarahchen",
    productId: "PROD-002",
    status: "approved",
    trackingLink: "https://track.sample.io/REQ-1002",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const COLLECTION_NAME = "sample_requests";

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<SampleRequest[]>([]);

  // Load from Firestore and subscribe to live updates
  useEffect(() => {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Seed Firestore with mock data once if collection is empty
          MOCK_REQUESTS.forEach(async (req) => {
            const ref = doc(db, COLLECTION_NAME, req.id);
            await setDoc(ref, {
              ...req,
              createdAt: req.createdAt,
            });
          });
          setRequests(MOCK_REQUESTS);
          return;
        }

        const loaded: SampleRequest[] = snapshot.docs.map((d) => {
          const data = d.data() as any;
          const base: SampleRequest = {
            id: data.id ?? d.id,
            creatorName: data.creatorName,
            email: data.email,
            channelLink: data.channelLink,
            productId: data.productId,
            status: data.status,
            trackingLink: data.trackingLink ?? null,
            createdAt:
              typeof data.createdAt === "string"
                ? data.createdAt
                : data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
          };
          return {
            ...base,
            trackingNumber: data.trackingNumber ?? null,
            carrier: data.carrier ?? null,
            shippingStatus: data.shippingStatus ?? null,
          };
        });

        setRequests(loaded);
      },
      (error) => {
        console.error("Failed to subscribe to Firestore requests:", error);
        // Fall back to mock data on error
        setRequests(MOCK_REQUESTS);
      }
    );

    return () => unsub();
  }, []);

  const addRequest = async (
    data: Omit<SampleRequest, "id" | "status" | "trackingLink" | "createdAt">
  ): Promise<SampleRequest> => {
    const id = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: SampleRequest = {
      ...data,
      id,
      status: "pending",
      trackingLink: null,
      createdAt: new Date().toISOString(),
    };

    const ref = doc(db, COLLECTION_NAME, id);
    await setDoc(ref, {
      ...newRequest,
      createdAt: serverTimestamp(),
    });

    // Local optimistic update; snapshot listener will keep it in sync
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequestStatus = async (id: string, status: RequestStatus) => {
    const ref = doc(db, COLLECTION_NAME, id);
    // Use local status page URL instead of external tracking URL
    // The link will be resolved relative to the current origin when used
    const trackingLink = status === "approved" ? `/status/${id}` : null;

    // When approving, seed initial tracking metadata
    const trackingNumber =
      status === "approved" ? `TRK-${id}-${Math.floor(1000 + Math.random() * 9000)}` : null;
    const carrier = status === "approved" ? "SampleCarrier" : null;
    const shippingStatus: ShippingStatus | null = status === "approved" ? "label_created" : null;

    await updateDoc(ref, {
      status,
      trackingLink,
      trackingNumber,
      carrier,
      shippingStatus,
    });

    // Optimistic local update
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              trackingLink,
              trackingNumber,
              carrier,
              shippingStatus,
            }
          : req
      )
    );
  };

  const updateShippingStatus = async (id: string, shippingStatus: ShippingStatus) => {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, { shippingStatus });

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              shippingStatus,
            }
          : req
      )
    );
  };

  const getRequestById = (id: string) => {
    return requests.find((req) => req.id === id);
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        updateShippingStatus,
        getRequestById,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestProvider");
  }
  return context;
}
