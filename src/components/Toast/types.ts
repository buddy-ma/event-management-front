export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
}

export interface ToastConfig {
  position: ToastPosition;
  duration: number;
  showProgressBar: boolean;
  pauseOnHover: boolean;
}

export default ToastProps;
