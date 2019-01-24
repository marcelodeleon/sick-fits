import React from 'react';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import PropTypes from 'prop-types';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`;

class Reset extends React.Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  saveToState = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}>
        {(resetPassword, {error, loading, called}) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await resetPassword();
                this.setState({password: '', confirmPassword: ''});
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password!</h2>
                <ErrorMessage error={error} />
                {!error && !loading && called && (
                  <p>Password changed successfully!</p>
                )}
                <label htmlFor="password">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
              </fieldset>
              <button type="submit">Reset Password!</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Reset;
