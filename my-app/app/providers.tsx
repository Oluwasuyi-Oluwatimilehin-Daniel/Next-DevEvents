"use client";

import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import PostHogPageView from "./PostHogPageView";

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}
