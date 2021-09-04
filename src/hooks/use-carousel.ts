import { useState, MouseEvent } from 'react';

export interface UseCarousel {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  index: number;
  setIndex: (index: number) => void;
  toggle: (index?: number) => (event: MouseEvent<HTMLAnchorElement>) => void;
  close: () => void;
}

const useCarousel = (): UseCarousel => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const toggle = (index?: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (index !== undefined) {
      setIndex(index);
    }
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    index,
    setIndex,
    toggle,
    close,
  };
};

export default useCarousel;
