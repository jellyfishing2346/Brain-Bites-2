import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FuzzySet from 'fuzzyset.js';
import Card from './Card';
import '../App.css';

const CardSet = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([
    { id: 9, name: "General Knowledge", color: "#FF6B6B", image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/General_knowledge.jpg?20191216183143.jpg"},
    { id: 17, name: "Science & Nature", color: "#4ECDC4", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBXn6DJH4vLEkCuZPd1BmZ0m0kAUtrjPSvIw&s.jpg" },
    { id: 23, name: "History", color: "#45B7D1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi8WIbygABOumAwFobsiK6srrzdNmD0OIGPQ&s.jpg" },
    { id: 21, name: "Sports", color: "#FFA07A", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ZOGCV4GvHVrXGQk6y61Kn2pH5trMZIvtow0oVLJMxbNlHEm8-65VFGv7RGZW5yzI1s0&usqp=CAU.jpg" },
    { id: 12, name: "Music", color: "#9370DB", image: "https://t3.ftcdn.net/jpg/03/20/41/30/360_F_320413016_omSvNeOZw7UrPyMvCf95KTCKzt6WbHXG.jpg" },
    { id: 19, name: "Mathematics", color: "#FFD700", image: "https://stcmalta.com/wp-content/uploads/2022/03/Art_role-of-Mathematics-1030x257.png" },
    { id: 22, name: "Geography", color: "#20B2AA", image: "https://www.aag.org/wp-content/uploads/2021/12/shutterstock_1111879247.jpg" },
    { id: 10, name: "Books", color: "#DDA0DD", image: "https://s26162.pcdn.co/wp-content/uploads/sites/2/2022/08/Books.jpg" },
    { id: 18, name: "Computer Science", color: "#00CED1", image: "https://plus.unsplash.com/premium_photo-1661872817492-fd0c30404d74?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tcHV0ZXIlMjBzY2llbmNlfGVufDB8fDB8fHww.jpg" },
    { id: 25, name: "Art", color: "#FF69B4", image: "https://i0.wp.com/doodlewash.com/wp-content/uploads/2022/08/Minnie-Small-Bird.jpg?w=1024&ssl=1.jpg" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchQuestions = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
      const formattedCards = response.data.results.map(question => ({
        id: Math.random().toString(36).substr(2, 9),
        question: decodeHtml(question.question),
        answer: decodeHtml(question.correct_answer),
        category: question.category,
        mastered: false
      }));
      setCards(formattedCards);
      setCurrentCardIndex(0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (cards.length > 0) {
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % cards.length);
      resetGuess();
    }
  };

  const previousCard = () => {
    if (cards.length > 0) {
      setCurrentCardIndex(prevIndex => (prevIndex - 1 + cards.length) % cards.length);
      resetGuess();
    }
  };

  const resetGuess = () => {
    setUserGuess("");
    setFeedback("");
    setShowAnswer(false);
  };

  const handleGuessSubmit = () => {
    const currentCard = cards[currentCardIndex];
    const fuzzy = FuzzySet([currentCard.answer.toLowerCase()]);
    const [match] = fuzzy.get(userGuess.toLowerCase()) || [];
    
    if (match && match[0] > 0.8) {
      setFeedback("Correct!");
      setStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        setLongestStreak(prev => Math.max(prev, newStreak));
        return newStreak;
      });
    } else {
      setFeedback("Incorrect. Try again!");
      setStreak(0);
    }
    setShowAnswer(true);
  };

  const shuffleCards = () => {
    setCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    resetGuess();
  };

  const markAsMastered = () => {
    const updatedCards = cards.map((card, index) => 
      index === currentCardIndex ? { ...card, mastered: true } : card
    );
    setCards(updatedCards);
    setMasteredCards(prev => [...prev, updatedCards[currentCardIndex]]);
    nextCard();
  };

  const removeFromMastered = (cardId) => {
    setMasteredCards(prev => prev.filter(card => card.id !== cardId));
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, mastered: false } : card
    ));
  };

  const getCategoryStyle = () => {
    const category = categories.find(cat => cat.id === parseInt(selectedCategory));
    return category ? { backgroundColor: category.color } : {};
  };

  const getCategoryInfo = () => {
    const category = categories.find(cat => cat.id === parseInt(selectedCategory));
    return category ? { imageUrl: category.image, name: category.name } : null;
  };
  
  return (
    <div className="card-set">
      <div className="header" style={getCategoryStyle()}>
        <div>
          <h1>Brain Bites</h1>
          <p className="general-description">10 cards for each category to test your trivia</p>
        </div>
        <img src="./src/brain.jpg" alt="A detailed illustration of the human brain" className="logo" />
      </div>
      
      <div className="category-selector">
        <select 
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="content" style={getCategoryStyle()}>
          <div className="category-image">
            <h2>{getCategoryInfo().name}</h2>
            <img 
              src={getCategoryInfo().imageUrl} 
              alt={getCategoryInfo().name} 
              className="category-img"
            />
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : cards.length > 0 ? (
            <div className="flashcard-container">
              <Card 
                card={cards[currentCardIndex]} 
                categoryStyle={getCategoryStyle()} 
                showAnswer={showAnswer}
              />
              <div className="guess-container">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Enter your guess"
                />
                <button onClick={handleGuessSubmit}>Submit Guess</button>
              </div>
              {feedback && <p className="feedback">{feedback}</p>}
              <div className="button-container">
                <button onClick={previousCard} className="previous-button">Previous Card</button>
                <button onClick={nextCard} className="next-button">Next Card</button>
                <button onClick={shuffleCards} className="shuffle-button">Shuffle Cards</button>
                <button onClick={markAsMastered} className="master-button">Mark as Mastered</button>
              </div>
              <p>Card {currentCardIndex + 1} of {cards.length}</p>
              <p>Current Streak: {streak} | Longest Streak: {longestStreak}</p>
            </div>
          ) : null}

          <div className="mastered-cards">
            <h3>Mastered Cards</h3>
            {masteredCards.map(card => (
              <div key={card.id} className="mastered-card">
                <p>{card.question}</p>
                <button onClick={() => removeFromMastered(card.id)}>Remove from Mastered</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSet;
