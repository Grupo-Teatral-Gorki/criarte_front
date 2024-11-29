import React, { useEffect } from 'react';

const GoogleTag = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HZN9CJCRQJ';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-HZN9CJCRQJ');
    };
  }, []);

  return null;
};

export default GoogleTag;
