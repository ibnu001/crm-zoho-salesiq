'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $zoho?: any;
  }
}

export default function Home() {
  const [isZohoVisible, setIsZohoVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Check if Zoho chat window is open based on tabIndex
  const detectChatOpen = () => {
    const closeBtn = document.querySelector<HTMLDivElement>('#zs_fl_close');
    if (closeBtn) {
      const tabIndex = closeBtn.getAttribute('tabindex');
      setIsOpen(tabIndex === '0');
    }
  };

  // ✅ Utility to check if Zoho open/close button is visible
  const checkZohoVisibility = () => {
    const openBtn = document.querySelector('.siqico-chat.zsiq-chat-icn');
    const closeBtn = document.querySelector('#zs_fl_close');
    return !!(openBtn || closeBtn);
  };

  const clickZohoOpenButton = () => {
    const openBtn = document.querySelector<HTMLDivElement>('.siqico-chat.zsiq-chat-icn');
    openBtn?.click();
  };

  const clickZohoCloseButton = () => {
    const closeBtn = document.querySelector<HTMLDivElement>('#zs_fl_close');
    closeBtn?.click();
  };

  const toggleZohoChat = () => {
    if (!isZohoVisible) return;
    isOpen ? clickZohoCloseButton() : clickZohoOpenButton();
  };

  // ✅ Detect Zoho availability + chat open state
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.$zoho) {
        const visible = checkZohoVisibility();
        setIsZohoVisible(visible);
        detectChatOpen();

        if (visible) clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // ✅ MutationObserver: track changes to tabIndex
  useEffect(() => {
    console.log("many")
    const target = document.querySelector('#zs_fl_close');
    if (!target) return;

    const observer = new MutationObserver(() => {
      detectChatOpen();
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ['tabindex'],
    });

    return () => observer.disconnect();
  }, [isZohoVisible]);

  return (
    <div className="flex flex-col min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold">
        Welcome to Zoho SalesIQ with Next.js and Tailwind CSS
      </h1>
      <p className="mt-4 text-lg">
        This is a simple setup to integrate Zoho SalesIQ with Next.js and Tailwind CSS.
        You can start building your application from here.
      </p>

      <button
        onClick={toggleZohoChat}
        disabled={!isZohoVisible}
        className={cn(
          'mt-4 px-10 py-2 bg-[#F27830] hover:bg-[#E26217] text-white rounded-full w-fit transition-all',
          {
            'opacity-50 cursor-not-allowed': !isZohoVisible,
          }
        )}
      >
        {isOpen ? 'Tutup Chat' : 'Chat Sekarang'}
      </button>
    </div>
  );
}
