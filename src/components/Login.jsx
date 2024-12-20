// src/components/Login.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const Login = () => {
    const { user, signInWithGoogle, logout } = useAuth();

    return (
        <div className="flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-4">
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700">{user.displayName}</span>
                    <Button
                        onClick={logout}
                        variant="outline"
                        className="text-sm"
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={signInWithGoogle}
                    className="bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="Google"
                        className="w-4 h-4 mr-2"
                    />
                    Sign in with Google
                </Button>
            )}
        </div>
    );
};

export default Login;