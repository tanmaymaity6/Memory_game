import React, { useEffect, useState } from "react";
import _ from "lodash";

export default function MemoryGame({ images }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [hasWon, setHasWon] = useState(false);


  // Initialize cards
  useEffect(() => {
    const duplicated = [...images, ...images];
    const shuffled = _.shuffle(duplicated);
    const cardObjects = shuffled.map((image, idx) => ({
      id: idx,
      image,
      flipped: false,
      matched: false,
    }));
    setCards(cardObjects);
  }, [images]);

  const restartGame = () => {
    const duplicated = [...images, ...images];
    const shuffled = _.shuffle(duplicated);
    const cardObjects = shuffled.map((image, idx) => ({
      id: idx,
      image,
      flipped: false,
      matched: false,
    }));
  
    setCards(cardObjects);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setHasWon(false);
  };
  

  const handleFlip = (id) => {
    const newCards = [...cards];
    const clickedCard = newCards[id];

    if (clickedCard.flipped || clickedCard.matched || flippedCards.length === 2)
      return;

    clickedCard.flipped = true;
    const newFlipped = [...flippedCards, id];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
    setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = newCards[firstId];
      const second = newCards[secondId];

      if (first.image === second.image) {
        setMatches((m) => m + 1);
        const updated = newCards.map((card) =>
          card.image === first.image ? { ...card, matched: true } : card
        );
        setCards(updated);
        setFlippedCards([]);
        const allMatched = updated.every((card) => card.matched);
        if (allMatched){
          setHasWon(true);
        }
      } else {
        setTimeout(() => {
          const reset = newCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, flipped: false }
              : card
          );
          setCards(reset);
          setFlippedCards([]);
        }, 1000);
      }

    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Restart button */}
      <button
        onClick={restartGame}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4f46e5",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        🔁 Restart Game
      </button>
  
      {/* Stats */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <h3>Moves: {moves}</h3>
        <h4>Matches: {matches}</h4>
      </div>
  
      {/* 🏆 You Won Message */}
      {hasWon && (
        <div
          style={{
            marginBottom: "20px",
            color: "green",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          🎉 You Won! Great Memory!
        </div>
      )}
  
      {/* Game Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 100px)",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            style={{
              width: "100px",
              height: "140px",
              position: "relative",
              cursor: "pointer",
              perspective: "1000px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.5s",
                transform:
                  card.flipped || card.matched
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
              }}
            >
              {/* Front side */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#aaa",
                  color: "white",
                  fontSize: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  backfaceVisibility: "hidden",
                }}
              >
                ?
              </div>
  
              {/* Back side */}
              <img
                src={card.image}
                alt="memory"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
  
  
}
