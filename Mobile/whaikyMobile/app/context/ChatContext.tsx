import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { useUser } from './UserContext'; // Import your UserContext

interface ChatContextProps {
  data: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}
interface ChatState {
    chatId: string;
    user: any; // Replace 'any' with the actual type of your user
  }
  
  interface ChatAction {
    type: 'CHANGE_USER';
    payload: any; // Replace 'any' with the actual type of your user
  }
  

// Initialize ChatContext with types
export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { currentUser } = useUser(); // Use your UserContext
  const INITIAL_STATE: ChatState = {
    chatId: 'null',
    user: {}, // Initialize as empty or however you see fit
  };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  let chatId = 'unknown';  // Default value

  if (currentUser && currentUser.uid) {
    chatId = currentUser.uid > action.payload.uid
      ? `${currentUser.uid}${action.payload.uid}`
      : `${action.payload.uid}${currentUser.uid}`;
  }

  switch (action.type) {
    case 'CHANGE_USER':
      return {
        user: action.payload,
        chatId: chatId
      };
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
