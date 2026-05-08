import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import HomeScreen from './src/screens/buyer/HomeScreen';

export default function App() {
  return (
    <AuthProvider>
      <HomeScreen />
    </AuthProvider>
  );
}
