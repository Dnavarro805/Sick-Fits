import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: Sting!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on userAuthenticationWithPasswordSuccess {
                item {
                    id
                    email
                    name
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                code 
                message
            }
        }
    }
`;

export default function SignIn() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
    });
    const [signin, { data, loading }] = useMutation
    (SIGNIN_MUTATION, {
        variables: inputs,
        // refetch the currently loggen in user
        refetchQueries: [{query: CURRENT_USER_QUERY }],
    });
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(inputs);
        const res = await signin();
        console.log(res);
        resetForm();
        // Send the email and password to the graphqlAPI
    }
    const error = 
        data?.authenticateUserWithPassword.__typename === 
        "UserAuthenticationWithPasswordFailure"
        ? data?.authenticateUserWithPassword 
        : undefined;
    return (
        <Form method="POST" onSubmit={handleSubmit}>
            <h2>Sign Into Your Account</h2>
            <Error error={error} />
            <fieldset>
                <label htmlFor="email">
                    Email
                    <input
                        type="email"
                        name="name"
                        placeholder="Your Email Address"
                        autoComplete="email"
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="password"
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Sign In!</button>
            </fieldset>
        </Form>
    );
}