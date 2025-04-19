import React, { useState, useEffect } from "react";

const defaultText =
  "O’nun Adıyla Başlarken, Hamd, âlemlerin Rabbi Allâhü Teâlâ içindir. Salât ve selâm da Peygamberimiz Efendimiz Hazreti Muhammed’edir.";

const ReadingApp = () => {
  const [text, setText] = useState(defaultText);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState(15);
  const [delay, setDelay] = useState(1000);
  const [isPaused, setIsPaused] = useState(false);
  const [readingMode, setReadingMode] = useState("standart");
  const [theme, setTheme] = useState("light");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    if (isPaused) return;
    const interval = setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex((prevIndex) => {
          setWordCount((prevCount) => prevCount + 1);
          return prevIndex + 1;
        });
      }
    }, getWordDelay(words[currentIndex]));
    return () => clearTimeout(interval);
  }, [currentIndex, words, isPaused, readingMode]);

  const getWordDelay = (word) => {
    if (readingMode === "hızlı") return delay * 0.7;
    if (readingMode === "derinlemesine") return delay * 1.5;
    if (/[.!?]/.test(word)) return delay * 2;
    if (/[,;:]/.test(word)) return delay * 1.5;
    return delay;
  };

  const getVisibleText = () => {
    let visibleWords = words.slice(currentIndex, currentIndex + windowSize);
    while (visibleWords.length < windowSize) {
      visibleWords.push(" ");
    }
    return visibleWords.join(" ");
  };

  const handleTextUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    }
  };

  const toggleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(getVisibleText());
    if (!isSpeaking) {
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <h2>Hızlı Okuma Uygulaması</h2>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          padding: "10px",
          backgroundColor: "yellow",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          margin: "auto",
          minHeight: "50px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {getVisibleText()}
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Pencere Genişliği: </label>
        <input
          type="number"
          value={windowSize}
          onChange={(e) => setWindowSize(Number(e.target.value))}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Duraklama Süresi (ms): </label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setDelay((prev) => Math.max(prev - 200, 200))}>
          Hızı Artır
        </button>
        <button onClick={() => setDelay((prev) => prev + 200)}>
          Hızı Azalt
        </button>
        <button onClick={() => setIsPaused((prev) => !prev)}>
          {isPaused ? "Devam Et" : "Durdur"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Okuma Modu: </label>
        <select
          onChange={(e) => setReadingMode(e.target.value)}
          value={readingMode}
        >
          <option value="standart">Standart</option>
          <option value="hızlı">Hızlı</option>
          <option value="derinlemesine">Derinlemesine</option>
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 5, 0))}
        >
          ⏪ Geri
        </button>
        <button
          onClick={() =>
            setCurrentIndex((prev) => Math.min(prev + 5, words.length - 1))
          }
        >
          ⏩ İleri
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={toggleSpeech}>
          {isSpeaking ? "Durdur" : "Sesli Oku"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Açık Tema" : "Karanlık Tema"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>İstatistikler</h3>
        <p>Okunan Kelime Sayısı: {wordCount}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <input type="file" accept=".txt" onChange={handleTextUpload} />
      </div>
    </div>
  );
};

export default ReadingApp;
