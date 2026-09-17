// src/utils/toast.ts
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// Configure toastr options for UAGRM D.U.B.S. theme
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 4000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};

export const showToast = {
  success: (message: string, title?: string) => {
    toastr.success(message, title || 'Éxito');
  },
  error: (message: string, title?: string) => {
    toastr.error(message, title || 'Error');
  },
  info: (message: string, title?: string) => {
    toastr.info(message, title || 'Información');
  },
  warning: (message: string, title?: string) => {
    toastr.warning(message, title || 'Advertencia');
  },
};

export default showToast;
