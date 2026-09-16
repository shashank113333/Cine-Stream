import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * @param {any} value - इनपुट की करंट वैल्यू
 * @param {number} delay - कितने मिलीसेकंड रुकना है (डिफ़ॉल्ट 500ms - Phase 2 Rule)
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // जब यूज़र टाइप करे, तो 500ms का टाइमर शुरू करो
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // अगर 500ms पूरा होने से पहले यूज़र ने अगला अक्षर दबा दिया, 
    // तो पुराने टाइमर को कैंसल (Clear) कर दो!
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};