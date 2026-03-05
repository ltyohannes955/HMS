'use client';

import * as React from 'react';
import type { ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
};

type State = {
    toasts: ToasterToast[];
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: { type: string; toast?: Partial<ToasterToast>; toastId?: string }) {
    switch (action.type) {
        case 'ADD_TOAST':
            memoryState = {
                toasts: [action.toast as ToasterToast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
            };
            break;
        case 'DISMISS_TOAST': {
            memoryState = {
                toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
            };
            break;
        }
    }
    listeners.forEach((listener) => listener(memoryState));
}

let count = 0;

function toast({ ...props }: Omit<ToasterToast, 'id'>) {
    const id = String(++count);
    dispatch({ type: 'ADD_TOAST', toast: { ...props, id, open: true } });
    setTimeout(() => dispatch({ type: 'DISMISS_TOAST', toastId: id }), TOAST_REMOVE_DELAY);
    return { id };
}

function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    };
}

export { useToast, toast };
