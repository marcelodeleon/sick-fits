import React from 'react';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import {CURRENT_USER_QUERY} from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!
    $password: String!
  ) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends React.Component {
  state = {
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}>
        {(signin, {error, loading}) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await signin();
                this.setState({email: '', password: ''});
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In for An Account</h2>
                <ErrorMessage error={error} />
                <label htmlFor="email">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
              </fieldset>
              <button type="submit">Sign In!</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
