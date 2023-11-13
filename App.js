import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ChatContextProvider } from './src/context/ChatContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthStackScreens from './src/navigation/AuthStack';
import FlashMessage from 'react-native-flash-message';

function Main() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Handle loading state here
    return null;
  }

  return (
    <>
      {currentUser ? <DrawerNavigator /> : <AuthStackScreens />}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatContextProvider>
          <NavigationContainer>
            <Main />
            <FlashMessage position="top" style={{ zIndex: 9999 }} />
          </NavigationContainer>
        </ChatContextProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
