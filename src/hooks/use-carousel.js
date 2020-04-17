import { useState } from 'react';

const useCarousel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const toggle = (event, index) => {
    event.preventDefault();
    if (index !== undefined) {
      setIndex(index);
    }
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    setIsOpen,
    index,
    setIndex,
    toggle,
  };
};

export default useCarousel;
