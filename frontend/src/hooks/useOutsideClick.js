import { useEffect } from 'react';

const useOutsideClick = (ref, callback, when = true) => {
  useEffect(() => {
    if (!when) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback, when]);
};

export default useOutsideClick;
