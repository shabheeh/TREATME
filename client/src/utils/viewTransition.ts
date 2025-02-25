export const transitionStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fade-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
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
