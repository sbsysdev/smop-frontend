/* react */
import { createContext } from 'react';
/* props */
import { SignInContext } from './SignIn.props';

export const Context = createContext<SignInContext>({
    /* functions */
    handleSignIn: () => new Promise<void>(resolve => resolve()),
    /* props */
    emailProps: { field: {} },
    passwordProps: { field: {} },
});
