import { useState, useCallback } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (variant, title, description, duration) => {
      return addToast({ variant, title, description, duration });
    },
    [addToast]
  );

  return {
    toasts,
    toast,
    success: (title, description, duration) =>
      toast("success", title, description, duration),
    error: (title, description, duration) =>
      toast("error", title, description, duration),
    warning: (title, description, duration) =>
      toast("warning", title, description, duration),
    info: (title, description, duration) =>
      toast("info", title, description, duration),
    removeToast,
  };
}

