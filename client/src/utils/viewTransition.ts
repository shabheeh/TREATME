export const transitionStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fade-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
  ::view-transition-old(medication-item) {
    animation: 300ms cubic-bezier(0.4, 0.0, 0.2, 1) both fade-out;
  }
  ::view-transition-new(medication-item) {
    animation: 300ms cubic-bezier(0.4, 0.0, 0.2, 1) both fade-in;
  }
  ::view-transition-old(medication-form) {
    animation: 300ms cubic-bezier(0.4, 0.0, 0.2, 1) both fade-out;
  }
  ::view-transition-new(medication-form) {
    animation: 300ms cubic-bezier(0.4, 0.0, 0.2, 1) both fade-in;
  }
`;

export const startViewTransition = async (
  callback: () => void | Promise<void>
) => {
  if (!document.startViewTransition) {
    return callback();
  }
  return document.startViewTransition(callback);
};
