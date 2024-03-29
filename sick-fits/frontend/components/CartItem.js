import React from 'react';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import PropTypes from 'prop-types';
import DeleteCartItem from './DeleteCartItem';

const CartItemStyled = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin 0;
  }
`;

const CartItem = ({cartItem}) => {
  if (!cartItem.item)
    return (
      <CartItemStyled>
        <p>The item is no longer available.</p>
        <DeleteCartItem id={cartItem.id} />
      </CartItemStyled>
    );

  return (
    <CartItemStyled>
      <img width="100" src={cartItem.item.image} alt={cartItem.item.title} />
      <div className="cart-item-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          {formatMoney(cartItem.item.price * cartItem.quantity)}
          {' - '}
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
          </em>
        </p>
      </div>
      <DeleteCartItem id={cartItem.id} />
    </CartItemStyled>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default CartItem;
