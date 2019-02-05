import React from 'react';
import {Mutation} from 'react-apollo';
import {CURRENT_USER_QUERY} from './User';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class DeleteCartItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  update = (cache, payload) => {
    const data = cache.readQuery({query: CURRENT_USER_QUERY});
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

    cache.writeQuery({query: CURRENT_USER_QUERY, data});
  };

  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{
          id: this.props.id,
        }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
          __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, {loading}) => (
          <BigButton
            title="Delete item"
            onClick={() => removeFromCart().catch(error => alert(error))}
            disabled={loading}>
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default DeleteCartItem;
