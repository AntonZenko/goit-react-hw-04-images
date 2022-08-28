import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Overlay, ModalBody, Image } from './Modal.styled';

export default function Modal({ images, modalId, toggleModal }) {
  useEffect(() => {
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, []);

  const closeModal = event => {
    (event.key === 'Escape' || event.target === event.currentTarget) &&
      toggleModal();
  };

  return (
    <Overlay onClick={closeModal}>
      <ModalBody>
        {images.map(image =>
          modalId === `${image.id}` ? (
            <Image src={image.largeImageURL} alt={image.tags} key={image.id} />
          ) : null
        )}
      </ModalBody>
    </Overlay>
  );
}

Modal.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  ).isRequired,
  modalId: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
