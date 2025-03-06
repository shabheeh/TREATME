import { useState } from "react";
import Toast, { ToastProps } from "../components/basics/toaster/Toast";

export const useToastManager = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        ...toast,
        id,
        onClose: () => removeToast(id),
      },
    ]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const toastElements = toasts.map((toast) => (
    <Toast key={toast.id} {...toast} />
  ));

  return {
    addToast,
    removeToast,
    toastElements,
  };
};
