import React, { useState, useEffect, useRef } from 'react';

interface GlitchyTextProps {
    text: string; // Define the type of the 'text' prop
    changeable: string[];
}   

function GlitchyText({ text, changeable }: GlitchyTextProps) {
  const [currentText, setCurrentText] = useState(text);
  const timeoutRef = useRef(null as any); // Timeout reference for reset
  const intervalRef = useRef(null as any); // Interval reference for glitch
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789#@&"

  const alphabetLength = alphabet.length
  const changeableCharsLength = changeable.length

  useEffect(() => {
    intervalRef.current = setInterval(() => {
        var newText = text
        var sourceChar = changeable[Math.floor(Math.random() * changeableCharsLength)]
        var targetChar = alphabet[Math.floor(Math.random() * alphabetLength)]

        if(Math.random() < 0.3)
            newText = newText.replace(sourceChar, targetChar)

        setCurrentText(newText);

      // Clear previous timeout (if any) before setting a new one
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrentText(text); // Reset to original text after 500ms
      }, Math.floor(Math.random() * 500) + 100);
    }, Math.floor(Math.random() * 1000) + 500); // Random interval between 500ms and 1500ms

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current); // Clear any remaining timeout on unmount
    };
  }, [text]);

  return (
    <span className="text-muted-foreground">{currentText}</span>
  );
}

export default GlitchyText;