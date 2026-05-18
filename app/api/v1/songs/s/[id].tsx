import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ShareRedirect() {
  const { id } = useLocalSearchParams();
  
  // Redirects the deep link automatically to your actual song screen!
  return <Redirect href={`/song/${id}`} />;
}
