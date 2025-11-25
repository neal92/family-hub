'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // For now, we'll just throw the error to make it visible in the Next.js overlay.
      // In a real app, you might want to show a toast or a different UI element.
      // The key is that this component is a client component and can handle browser-side effects.
      console.error(
        'Firebase Permission Error Detected. See details in the thrown error below.'
      );
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null; // This component does not render anything
}
