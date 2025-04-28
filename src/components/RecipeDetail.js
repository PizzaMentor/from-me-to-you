import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function RecipeDetail({ recipe, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceControlActive, setVoiceControlActive] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      // Default: pick first female English voice, else first English, else first
      const defaultVoice =
        allVoices.find(v => v.lang.startsWith('en') && v.gender === 'female') ||
        allVoices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
        allVoices.find(v => v.lang.startsWith('en')) ||
        allVoices[0];
      setSelectedVoice(defaultVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!voiceControlActive) return;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      handleVoiceCommand(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line
  }, [voiceControlActive, currentStep, recipe.instructions]);

  const handleVoiceChange = (e) => {
    const voice = voices.find(v => v.voiceURI === e.target.value);
    setSelectedVoice(voice);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const speakStep = (stepIndex) => {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(recipe.instructions[stepIndex]);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('start')) {
      setCurrentStep(0);
      speakStep(0);
    } else if (command.includes('stop')) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (command.includes('next')) {
      const next = Math.min(currentStep + 1, recipe.instructions.length - 1);
      setCurrentStep(next);
      speakStep(next);
    } else if (command.includes('back') || command.includes('previous')) {
      const prev = Math.max(currentStep - 1, 0);
      setCurrentStep(prev);
      speakStep(prev);
    } else if (command.includes('repeat')) {
      speakStep(currentStep);
    } else if (command.match(/step (\d+)/)) {
      const stepNum = parseInt(command.match(/step (\d+)/)[1], 10) - 1;
      if (stepNum >= 0 && stepNum < recipe.instructions.length) {
        setCurrentStep(stepNum);
        speakStep(stepNum);
      }
    }
  };

  const speakRecipe = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = `${recipe.name}. ${recipe.description}. 
        Ingredients: ${recipe.ingredients.join(', ')}. 
        Instructions: ${recipe.instructions.join('. ')}`;
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      if (selectedVoice) utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const printRecipe = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${recipe.name} - Recipe</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .recipe-meta { margin: 10px 0; }
            .recipe-meta span { margin-right: 15px; }
            .ingredients-section, .instructions-section { margin: 20px 0; }
            .recipe-image { max-width: 100%; height: auto; margin: 20px 0; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${recipe.name}</h1>
          <div class="recipe-meta">
            <span>Category: ${recipe.category}</span>
            <span>Time: ${recipe.cookingTime || '30-45'} mins</span>
            <span>Servings: ${recipe.servings || '4'}</span>
          </div>
          ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" />` : ''}
          <p>${recipe.description || `A delicious ${recipe.category.toLowerCase()} recipe that's perfect for any occasion.`}</p>
          <div class="ingredients-section">
            <h2>Ingredients</h2>
            <ul>
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
          <div class="instructions-section">
            <h2>Instructions</h2>
            <ol>
              ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
          <div class="no-print">
            <p>Printed from From Me To You Recipe Book</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const toggleVoiceControl = () => {
    setVoiceControlActive((prev) => !prev);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content recipe-book-modal">
        <button className="close-button" onClick={onClose} aria-label="Close recipe">
          ×
        </button>
        <div className="recipe-book-header">
          <div className="recipe-book-title-section">
            <h1 className="recipe-book-title">{recipe.name}</h1>
            {recipe.description && (
              <div className="recipe-book-subtitle">{recipe.description}</div>
            )}
          </div>
          {/* Optional: Star rating can go here */}
        </div>
        <div className="recipe-book-image-container">
          <img 
            src={recipe.image || '/images/placeholder-recipe.jpg'} 
            alt={recipe.name}
            className="recipe-book-image"
          />
        </div>
        <div className="recipe-book-content">
          <div className="recipe-book-col recipe-book-ingredients">
            <div className="recipe-book-meta">
              <span><i className="fas fa-users"></i> {recipe.servings || '4'} servings</span>
              <span><i className="far fa-clock"></i> {recipe.cookingTime || '30-45'} minutes</span>
            </div>
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-book-col recipe-book-directions">
            <h2>Directions</h2>
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className={index === currentStep ? 'current-step' : ''}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="recipe-actions book-actions">
          <div style={{ flex: 1 }}>
            <label htmlFor="voice-select" style={{ fontSize: '0.95rem', marginRight: 8 }}>Voice:</label>
            <select id="voice-select" value={selectedVoice?.voiceURI || ''} onChange={handleVoiceChange} style={{ fontSize: '0.95rem', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
              {voices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} {voice.lang} {voice.gender ? `(${voice.gender})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button 
            className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
            onClick={speakRecipe}
          >
            <i className="fas fa-volume-up"></i>
            {isSpeaking ? 'Stop Speaking' : 'Read Recipe'}
          </button>
          <button className="print-button" onClick={printRecipe}>
            <i className="fas fa-print"></i> Print Recipe
          </button>
          <button className={`voice-control-button${voiceControlActive ? ' active' : ''}`} onClick={toggleVoiceControl} style={{ marginLeft: 8 }}>
            <i className="fas fa-microphone"></i> {voiceControlActive ? 'Stop Voice Control' : 'Start Voice Control'}
          </button>
          <span className="voice-info-tooltip" tabIndex="0" aria-label="Voice command info">ℹ️
            <div className="voice-tooltip-text">
              <h3>Voice Commands:</h3>
              <span data-command='"Start"' data-description="– read from step 1"></span>
              <span data-command='"Next"' data-description="– next step"></span>
              <span data-command='"Back"' data-description="– previous step"></span>
              <span data-command='"Previous"' data-description="– previous step"></span>
              <span data-command='"Repeat"' data-description="– repeat current step"></span>
              <span data-command='"Step 3"' data-description="– go to step 3"></span>
              <span data-command='"Stop"' data-description="– stop reading"></span>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail; 