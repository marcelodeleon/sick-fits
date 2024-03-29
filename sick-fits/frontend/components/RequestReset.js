import React from 'react';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends React.Component {
  state = {
    email: '',
  };

  saveToState = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}>
        {(reset, {error, loading, called}) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await reset();
                this.setState({email: ''});
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request Password Reset</h2>
                <ErrorMessage error={error} />
                {!error && !loading && called && (
                  <p>Reset requested. Check your email!</p>
                )}
                <label htmlFor="email">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
              </fieldset>
              <button type="submit">Request Reset!</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
