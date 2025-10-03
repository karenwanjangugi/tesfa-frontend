'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../sharedcomponents/Layout';
import ChatWidget from './components/ChatBot';

const MapClient = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div className="p-4">Loading map...</div>,
});
const DashboardPage = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {

      if (
        event.data &&
        (event.data.type === 'wallet_request' || event.data.type === 'mm_init')
      ) {
        if (
          event.source &&
          typeof (event.source as Window).postMessage === 'function'
        ) {
          (event.source as Window).postMessage(
            {
              type: 'wallet_response',
              status: 'ignored',
              id: event.data.id,
            },
            event.origin 
          );
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  return (
    <Layout>
      <div className="flex flex-row h-screen bg-gray-100">
        <main className="flex-1 relative">
          <MapClient />
          <ChatWidget />
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;