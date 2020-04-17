import React from 'react';
import {
  default as CarouselComponent,
  Modal,
  ModalGateway,
} from 'react-images';

const Carousel = ({ carousel, images }) => {
  return (
    <ModalGateway>
      {carousel.isOpen ? (
        <Modal onClose={(event) => carousel.toggle(event)}>
          <CarouselComponent currentIndex={carousel.index} views={images} />
        </Modal>
      ) : null}
    </ModalGateway>
  );
};

export default Carousel;
