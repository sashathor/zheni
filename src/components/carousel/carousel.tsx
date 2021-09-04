import React from 'react';
import {
  default as CarouselComponent,
  Modal,
  ModalGateway,
  ViewType,
} from 'react-images';
import { UseCarousel } from 'hooks';

interface CarouselProps {
  carousel: UseCarousel;
  images?: ViewType[];
}

const Carousel: React.FC<CarouselProps> = ({ carousel, images }) => (
  <ModalGateway>
    {carousel.isOpen && images ? (
      <Modal onClose={carousel.close}>
        <CarouselComponent currentIndex={carousel.index} views={images} />
      </Modal>
    ) : null}
  </ModalGateway>
);

export default Carousel;
