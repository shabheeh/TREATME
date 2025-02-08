import { useCallback } from 'react'
import { startViewTransition } from '../utils/viewTransition';

interface UseViewTransitionOptions {
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export const useViewTransition = (options: UseViewTransitionOptions = {}) => {
  const { onTransitionStart, onTransitionEnd } = options;

  const withTransition = useCallback(async (callback: () => void | Promise<void>) => {
    try {
      onTransitionStart?.();
      await startViewTransition(callback);
      onTransitionEnd?.();
    } catch (error) {
      console.error('View transition failed:', error);
      await callback();
    }
  }, [onTransitionStart, onTransitionEnd]);

  return { withTransition };
};