"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function ClientScripts() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script
        id="orchids-browser-logs"
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
        strategy="afterInteractive"
        data-orchids-project-id="5012a356-92cf-4bd6-8165-e061df3ebeb5"
        onError={(e) => {
          console.warn("Failed to load orchids-browser-logs script:", e);
        }}
      />
      <Script
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
        strategy="afterInteractive"
        data-target-origin="*"
        data-message-type="ROUTE_CHANGE"
        data-include-search-params="true"
        data-only-in-iframe="true"
        data-debug="true"
        data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        onError={(e) => {
          console.warn("Failed to load route-messenger script:", e);
        }}
      />
    </>
  );
}

