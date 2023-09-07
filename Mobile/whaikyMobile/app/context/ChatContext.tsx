import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useUser } from './UserContext';

export interface User {
    email?: string | null;
    uid?: string | null;
    photoURL?: string | null;
    country?: string;
    state?: string;
    city?: string;
    phones?: string[];
    firstName?: string;
    lastName?: string;
    userName?: string;
    createdAt?: Date | number;
    personalInfo?: string;
    legalInfo?: string;
}

export interface ChatState {
    chatId: string;
    user: User;
}

type ActionTypes = "CHANGE_USER";

interface ChangeUserPayload {
    uid: string;
    [key: string]: any;
}

interface ChatAction {
    type: ActionTypes;
    payload: ChangeUserPayload;
}

interface ChatContextProviderProps {
    children: ReactNode;
}

export interface ChatContextValue {
    data: ChatState;
    dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
    const { currentUser } = useUser() as { currentUser: User | null };

    const INITIAL_STATE: ChatState = {
        chatId: "null",
        user: {} as User
    };

    const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
        switch (action.type) {
            case "CHANGE_USER":
                const currentUid = action.payload.uid;
                const targetUid = action.payload.targetUid;

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
