"use client"
const { createContext, useState, useEffect } = require("react");

export const AppContext = createContext();


export default function AppProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const getUser = async () => {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/api/user', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data);
            setLoading(false);
        }
        
    }
    useEffect(() => {
        if (token) {
            getUser()
        }
    }, [token])
    return (
        <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
            {children}
        </AppContext.Provider>
    );
}




