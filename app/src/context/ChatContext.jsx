import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from './AuthContext';

export const ChatContext = createContext(undefined);

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useAuth();

    

    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    };

    const chatReducer = (state, action) => {
        
        switch (action.type) {
            case "CHANGE_USER":
                const currentUid = currentUser && currentUser.uid;
                const targetUid = action.payload && action.payload.uid;

                if (currentUid && targetUid) {
                    return {
                        user: action.payload,
                        chatId: currentUid > targetUid
                            ? currentUid + targetUid
                            : targetUid + currentUid
                    };
                } else {
                    return state;
                }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatContextProvider");
    }
    return context;
}
