import React from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import {ALL_ITEMS_QUERY} from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends React.Component {
  handleDelete = (e, deleteItem, error) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem();
    }
  };

  update = (cache, payload) => {
    const data = cache.readQuery({query: ALL_ITEMS_QUERY});
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    );
    cache.writeQuery({query: ALL_ITEMS_QUERY, data});
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{id: this.props.id}}
        update={this.update}>
        {(deleteItem, {error}) => {
          return (
            <button onClick={e => this.handleDelete(e, deleteItem, error)}>
              {this.props.children}
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default DeleteItem;
