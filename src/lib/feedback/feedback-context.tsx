"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Modal } from "@/components/ui/modal";

type FeedbackVariant = "success" | "error" | "info";

type FeedbackState = {
  open: boolean;
  title: string;
  message: string;
  variant: FeedbackVariant;
};

type FeedbackContextValue = {
  showFeedback: (title: string, message: string, variant?: FeedbackVariant) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FeedbackState>({
    open: false,
    title: "",
    message: "",
    variant: "info",
  });

  const close = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const showFeedback = useCallback(
    (title: string, message: string, variant: FeedbackVariant = "info") => {
      setState({ open: true, title, message, variant });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string, title = "Success") => {
      showFeedback(title, message, "success");
    },
    [showFeedback],
  );

  const showError = useCallback(
    (message: string, title = "Something went wrong") => {
      showFeedback(title, message, "error");
    },
    [showFeedback],
  );

  const value = useMemo(
    () => ({ showFeedback, showSuccess, showError }),
    [showFeedback, showSuccess, showError],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Modal
        open={state.open}
        title={state.title}
        message={state.message}
        variant={state.variant}
        onClose={close}
      />
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}
