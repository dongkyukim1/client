"use client";

import { createPortal } from 'react-dom';
import { useRef, useState, useEffect, ReactNode } from 'react';

interface ModalContainerProps {
  children: ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
  const [mounted, setMounted] = useState(false);
  const modalRoot = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    modalRoot.current = document.getElementById('modal-root');
    if (!modalRoot.current) {
      modalRoot.current = document.createElement('div');
      modalRoot.current.id = 'modal-root';
      document.body.appendChild(modalRoot.current);
    }
    setMounted(true);
    
    return () => {
      if (modalRoot.current && modalRoot.current.parentElement) {
        modalRoot.current.parentElement.removeChild(modalRoot.current);
      }
    };
  }, []);

  return mounted && modalRoot.current 
    ? createPortal(children, modalRoot.current)
    : null;
} 