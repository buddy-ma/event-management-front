import Swal, { SweetAlertPosition } from "sweetalert2";
import { ToastProps } from "./types";
import { defaultToastConfig } from "./ToastConfig";

class ToastService {
  private static getToastConfig(type: ToastProps["type"]) {
    const colors = {
      success: { background: "#d4edda", text: "#155724", icon: "#28a745" },
      error: { background: "#f8d7da", text: "#721c24", icon: "#dc3545" },
      info: { background: "#cce5ff", text: "#004085", icon: "#17a2b8" },
      warning: { background: "#fff3cd", text: "#856404", icon: "#ffc107" },
    };

    return colors[type];
  }

  static show({
    message,
    type,
    position = defaultToastConfig.position,
    duration = defaultToastConfig.duration,
  }: ToastProps) {
    const colors = this.getToastConfig(type);

    return Swal.mixin({
      toast: true,
      position: position as SweetAlertPosition,
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: defaultToastConfig.showProgressBar,
      didOpen: (toast) => {
        if (defaultToastConfig.pauseOnHover) {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        }
      },
    }).fire({
      icon: type,
      title: message,
      background: colors.background,
      color: colors.text,
      iconColor: colors.icon,
    });
  }
}

export const toast = {
  success: (
    message: string,
    options?: Partial<Omit<ToastProps, "type" | "message">>
  ) => {
    return ToastService.show({ message, type: "success", ...options });
  },
  error: (
    message: string,
    options?: Partial<Omit<ToastProps, "type" | "message">>
  ) => {
    return ToastService.show({ message, type: "error", ...options });
  },
  info: (
    message: string,
    options?: Partial<Omit<ToastProps, "type" | "message">>
  ) => {
    return ToastService.show({ message, type: "info", ...options });
  },
  warning: (
    message: string,
    options?: Partial<Omit<ToastProps, "type" | "message">>
  ) => {
    return ToastService.show({ message, type: "warning", ...options });
  },
};

export default ToastService;
