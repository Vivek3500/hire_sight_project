import { useState, useEffect } from "react";
import { geminiService } from "@/services/geminiService";

const STORAGE_KEY = "hiresight-gemini-api-key";

export const useGeminiAPI = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      try {
        geminiService.initialize(storedKey);
        setIsInitialized(true);
      } catch (err) {
        setError("Failed to initialize Gemini API");
        console.error(err);
      }
    }
  }, []);

  const saveApiKey = (key: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
      geminiService.initialize(key);
      setIsInitialized(true);
      setError("");
      return true;
    } catch (err) {
      setError("Failed to save API key");
      console.error(err);
      return false;
    }
  };

  const removeApiKey = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setApiKey("");
      setIsInitialized(false);
      setError("");
      return true;
    } catch (err) {
      setError("Failed to remove API key");
      console.error(err);
      return false;
    }
  };

  return {
    apiKey,
    isInitialized,
    error,
    saveApiKey,
    removeApiKey,
  };
};
