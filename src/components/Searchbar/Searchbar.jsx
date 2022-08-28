import { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Form, Button, ButtonLabel, Input } from './Searchbar.styled';
import { FiSearch } from 'react-icons/fi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default function Searchbar({ onSubmit }) {
  const [searchValue, setSearchValue] = useState('');

  const handleNameChange = e => {
    setSearchValue(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (searchValue.trim() === '') {
      Notify.warning('Type something in the searchbar');
      return;
    }

    onSubmit(searchValue);
    setSearchValue('');
  };

  return (
    <Header>
      <Form onSubmit={handleSubmit}>
        <Button type="submit">
          <FiSearch stroke="#3f51b5" size="24px" />
          <ButtonLabel></ButtonLabel>
        </Button>

        <Input
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          name="input"
          value={searchValue}
          onChange={handleNameChange}
        />
      </Form>
    </Header>
  );
}
Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
