import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean) {
    const elementRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Store the currently focused element
        previousActiveElement.current = document.activeElement;

        // Focus the modal container
        if (elementRef.current) {
            elementRef.current.focus();
        }

        // Get all focusable elements
        const getFocusableElements = () => {
            if (!elementRef.current) return [];
            return Array.from(
                elementRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            );
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                return; // Let the parent component handle closing
            }

            if (e.key === 'Tab') {
                const focusableElements = getFocusableElements();
                const firstFocusableElement = focusableElements[0] as HTMLElement;
                const lastFocusableElement = focusableElements[
                    focusableElements.length - 1
                ] as HTMLElement;

                // If shift + tab
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement?.focus();
                    }
                }
                // If just tab
                else {
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement?.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';

            // Restore focus when the modal closes
            if (previousActiveElement.current instanceof HTMLElement) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen]);

    return elementRef;
}