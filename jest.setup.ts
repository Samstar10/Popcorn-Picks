import '@testing-library/jest-dom'

import 'whatwg-fetch'
import '@testing-library/jest-dom'
import React from 'react';

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const {
        src = '',
        alt = '',
        fill,      
        priority,    
        sizes,       
        placeholder,
        blurDataURL, 
        ...rest
      } = props;
      return React.createElement('img', {
        src: typeof src === 'string' ? src : '',
        alt,
        ...rest,
      });
    },
  };
});

class IO {
  constructor(cb: IntersectionObserverCallback) {
    // @ts-ignore
    this._cb = cb
  }
  // @ts-ignore
  observe = (el: Element) => {
    // @ts-ignore
    (el as any).__ioTrigger__ = (isIntersecting = true) => {
      // @ts-ignore
      this._cb([{ isIntersecting, target: el } as IntersectionObserverEntry], this)
    }
  }
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(global, 'IntersectionObserver', { value: IO })

jest.mock('zustand/middleware', () => ({
  persist: (config: any) => config
}));

jest.mock('keen-slider/react', () => ({
  useKeenSlider: () => [jest.fn()], 
}))