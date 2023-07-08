import { createContext, useEffect, useState, useContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const sub = authUser?.attributes?.sub;


    const getCurrentUser = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
            setAuthUser(currentUser);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (sub) {
            DataStore.query(User, (user) => user.sub.eq(sub)).then((users) =>
                setDbUser(users[0])
            ).catch(err => console.log(err))
        }

    }, [sub]);

    return (
        <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);