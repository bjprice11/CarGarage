import * as React from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  [key: string]: unknown;
}

interface ToastState {
  toasts: Toast[];
}

const toastLimit = 3;
let toastCount = 0;

const toastState: ToastState = { toasts: [] };
const listeners: Array<(state: ToastState) => void> = [];

function setState(update: (state: ToastState) => ToastState) {
  const next = update(toastState);
  toastState.toasts = next.toasts;
  listeners.forEach((listener) => listener(toastState));
}

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

export function toast(props: Omit<Toast, "id">) {
  const id = genId();
  const toast: Toast = { ...props, id };
  setState((state) => ({
    toasts: [toast, ...state.toasts].slice(0, toastLimit),
  }));
  return id;
}

export function useToast() {
  const [state, setLocalState] = React.useState(toastState);

  React.useEffect(() => {
    const listener = (next: ToastState) => setLocalState(next);
    listeners.push(listener);
    return () => {
      const i = listeners.indexOf(listener);
      if (i !== -1) listeners.splice(i, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => {
      setState((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    },
  };
}
