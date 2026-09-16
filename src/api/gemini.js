import axios from 'axios';

// 1. .env से Gemini API Key पढ़ना
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

// 2. स्मार्ट फॉलबैक (अगर अभी Gemini Key न हो तब भी टेस्ट करने के लिए)
const MOOD_FALLBACKS = [
  { keywords: ['action', 'fight', 'batman', 'thrill'], title: 'The Dark Knight' },
  { keywords: ['sad', 'cry', 'hope', 'emotional'], title: 'The Shawshank Redemption' },
  { keywords: ['space', 'sci-fi', 'future', 'mind'], title: 'Interstellar' },
  { keywords: ['dream', 'confusing', 'heist'], title: 'Inception' },
  { keywords: ['funny', 'laugh', 'comedy', 'deadpool'], title: 'Deadpool & Wolverine' },
  { keywords: ['music', 'drum', 'intense'], title: 'Whiplash' },
];

/**
 * FAQ #7: Gemini API को मूड भेजकर फ़िल्म का नाम मांगना
 * @param {string} moodText - यूज़र का मूड
 * @returns {Promise<string>} - फ़िल्म का साफ़-सुथरा नाम
 */
export const getMovieFromMood = async (moodText) => {
  if (!moodText || !moodText.trim()) {
    throw new Error('Please describe your mood or what you want to watch.');
  }

  // अगर Gemini Key उपलब्ध है, तो Google Gemini API को कॉल करो
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 5) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      // FAQ #7: सख्त और सटीक प्रॉम्प्ट
      const prompt = `Suggest ONE movie based on this mood: "${moodText.trim()}". Return ONLY the movie title as a plaintext string, without any quotes, markdown or explanations.`;

      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
      );

      const rawTitle = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawTitle) {
        // AI के उत्तर को साफ़ करना (Remove extra quotes or markdown)
        return rawTitle.replace(/[*#_`"]/g, '').replace(/\n.*/gs, '').trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic fallback:', err);
    }
  }

  // स्मार्ट फॉलबैक: यूज़र के मूड के आधार पर फ़िल्म चुनना
  await new Promise((res) => setTimeout(res, 600)); // AI जैसा छोटा डिले
  const lower = moodText.toLowerCase();
  for (const item of MOOD_FALLBACKS) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.title;
    }
  }

  return 'Inception';
};