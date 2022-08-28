import React from 'react';
import { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import getImages from './FetchService';
import Spinner from './Spinner';
import Message from './Message';
import Modal from './Modal';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default function App() {
  const [images, setImages] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(null);
  const [loader, setLoader] = useState(false);
  const [modalId, setModalId] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoader(true);
      try {
        const images = await getImages(searchValue, page);
        if (images.hits.length === 0) {
          setError(true);
          setLoader(false);
          return;
        }
        setImages(prevState => [...prevState, ...images.hits]);
        console.log(images.totalHits);
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }, 300);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoader(false);
      }
    };
    if (page > 1) {
      fetchImages();
    }
  }, [page, searchValue]);

  const onSubmit = async searchValue => {
    const page = 1;
    setSearchValue(searchValue);
    setPage(page);
    setLoader(true);

    const images = await getImages(searchValue, page);
    if (images.totalHits === 0) {
      setImages([]);
      setError(true);
      setLoader(false);
      Notify.failure('Nothing found. Try another search.');
      return;
    }
    Notify.success(`Found ${images.totalHits} images`);
    setImages(images.hits);
    setTotalHits(images.totalHits);
    setLoader(false);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const toggleModal = modalId => {
    setModalId(modalId);
  };

  if (images.length === totalHits) {
    Notify.info('No more images to show');
  }

  return (
    <>
      <Searchbar onSubmit={onSubmit} />
      {images.length !== 0 ? (
        <ImageGallery images={images} openModal={toggleModal} />
      ) : (
        <Message
          text={
            error
              ? 'Something went wrong :( Try again.'
              : 'Type something to search'
          }
        />
      )}

      {loader ? <Spinner /> : null}
      {images.length !== 0 && !loader && images.length !== totalHits && (
        <Button onClick={loadMore} />
      )}
      {modalId && (
        <Modal images={images} modalId={modalId} toggleModal={toggleModal} />
      )}
    </>
  );
}
