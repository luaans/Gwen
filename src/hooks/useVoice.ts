"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function useVoice() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const ignoreEndRef = useRef(false);

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(SpeechRecognitionCtor && window.speechSynthesis));
  }, []);

  const stopListening = useCallback(() => {
    ignoreEndRef.current = true;
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const listen = useCallback((onText: (text: string) => void) => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return false;

    try {
      recognitionRef.current?.abort?.();
    } catch {
      // ignore
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    ignoreEndRef.current = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) onText(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      if (!ignoreEndRef.current) setListening(false);
    };

    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
      return true;
    } catch {
      setListening(false);
      return false;
    }
  }, []);

  const speak = useCallback(
    (text: string, options?: { onEnd?: () => void }) => {
      if (!window.speechSynthesis) {
        options?.onEnd?.();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        options?.onEnd?.();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        options?.onEnd?.();
      };
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return {
    supported,
    listening,
    speaking,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  };
}
