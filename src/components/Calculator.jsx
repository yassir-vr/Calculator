import React, { useState, useEffect } from "react";

function Calculator() {
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const themes = {
    light: "bg-gray-100 text-gray-900",
    dark: "bg-gray-900 text-white",
    neon: "bg-black text-green-400",
  };

  const translations = {
    en: {
      clear: "Clear",
      calc: "Calculator",
      export: "Export History",
      history: "History",
      clearHistory: "Clear History",
    },
    fr: {
      clear: "Effacer",
      calc: "Calculatrice",
      export: "Exporter l'Historique",
      history: "Historique",
      clearHistory: "Effacer l'Historique",
    },
  };

  const clickHandle = (e) => {
    setResult(result.concat(e.target.value));
  };

  const clearScreen = () => {
    setResult("");
  };

  const calculate = () => {
    try {
      const evaluated = Function(`"use strict"; return (${result})`)();
      setResult(evaluated.toString());
      setHistory([...history, { expression: result, result: evaluated }]);
    } catch {
      setResult("Error");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setTheme(darkMode ? "light" : "dark");
  };

  const handleKeyPress = (e) => {
    if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
      setResult((prev) => prev + e.key);
    }
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") setResult((prev) => prev.slice(0, -1));
  };

  const downloadHistory = () => {
    const blob = new Blob([JSON.stringify(history)], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculator_history.txt";
    link.click();
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [result]);

  return (
    <div className={`${themes[theme]} w-screen h-screen flex justify-center items-center`}>
      <div className="relative w-96 h-auto rounded-2xl shadow-lg border p-6 space-y-4">
        {/* Icons for mode and language */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <button
            onClick={() => changeLanguage(language === "en" ? "fr" : "en")}
            className="p-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
          >
            {language === "en" ? "🇫🇷" : "🇬🇧"}
          </button>
        </div>

        {/* Screen */}
        <div className="screen mb-4">
          <input
            type="text"
            value={result}
            className="shadow-inner px-4 py-3 text-right outline-none rounded-lg w-full text-xl"
            placeholder="0"
            disabled
          />
        </div>

        {/* Calculator Title */}
        <div className="brand text-center mb-4">
          <h1 className="text-lg font-medium">{translations[language].calc}</h1>
        </div>

        {/* Keyboard */}
        <div className="keyboard grid grid-cols-4 gap-3">
          <button onClick={clearScreen} className="bg-red-500 text-white rounded-lg py-3">
            {translations[language].clear}
          </button>
          <button value="%" onClick={clickHandle} className="bg-gray-300 text-black rounded-lg py-3">
            %
          </button>
          <button value="/" onClick={clickHandle} className="bg-gray-300 text-black  rounded-lg py-3">
            ÷
          </button>
          <button value="*" onClick={clickHandle} className="bg-gray-300 text-black  rounded-lg py-3">
            ×
          </button>
          {[7, 8, 9, "-", 4, 5, 6, "+", 1, 2, 3, "="].map((btn, idx) => (
            <button
              key={idx}
              value={btn}
              onClick={btn === "=" ? calculate : clickHandle}
              className={`${
                btn === "=" ? "bg-green-500" : "bg-gray-300"
              } text-black rounded-lg py-3`}
            >
              {btn}
            </button>
          ))}
          <button value="0" onClick={clickHandle} className="bg-gray-300 text-black rounded-lg py-3">
            0
          </button>
          <button value="." onClick={clickHandle} className="bg-gray-300 text-black rounded-lg py-3">
            .
          </button>
          <button onClick={downloadHistory} className="bg-blue-500 text-white rounded-lg py-3 w-40">
            {translations[language].export}
          </button>
        </div>

        {/* History */}
        <div className="history mt-4">
          <h2 className="text-sm font-medium mb-2">{translations[language].history}</h2>
          <ul className="text-xs space-y-1">
            {history.map((entry, idx) => (
              <li key={idx}>
                {entry.expression} = {entry.result}
              </li>
            ))}
          </ul>
          <button
            onClick={clearHistory}
            className="mt-2 bg-red-600 text-white rounded-lg py-2 w-full"
          >
            {translations[language].clearHistory}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
