import React, { useState } from 'react';

const Card = ({ card, categoryStyle }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Add this function to decode HTML entities
  const decodeHTML = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const cardStyle = {
    ...categoryStyle,
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
  };

  const contentStyle = {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  };

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`} 
      style={cardStyle} 
      onClick={flipCard}
    >
      <div style={{...contentStyle, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
        <p>{decodeHTML(card.question)}</p>
      </div>
      <div style={{...contentStyle, transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)'}}>
        <p>{decodeHTML(card.answer)}</p>
      </div>
    </div>
  );
};

export default Card;