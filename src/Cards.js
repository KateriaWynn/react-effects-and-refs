import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import Card from './Card';
import './Cards.css';

function Cards() {
  const BASE_URL = 'http://deckofcardsapi.com';
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const deckId = useRef();

  console.log(cards);

  useEffect(() => {
    async function getDeck() {
      const newDeck = await axios.get(
        `${BASE_URL}/api/deck/new/draw/?deck_count=1`
      );
      deckId.current = newDeck.data.deck_id;
      setDeck(newDeck.data);
    }
    getDeck();
  }, []);

  async function drawCard() {
    const id = deckId.current;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/deck/${id}/draw/?count=1`
      );

      const card = response.data.cards[0];
      const cardsRemaining = response.data.remaining;
      console.log(cardsRemaining);
      const newCard = {
        ...card,
        id: card.code,
        key: uuid(),
        value: card.value,
        suit: card.suit,
        image: card.image,
      };
      setCards((cards) => [...cards, newCard]);

      if (cardsRemaining === 0) {
        console.log('hidden');
      }
    } catch (err) {
      alert(err);
    }
  }

  const cardComponents = cards.map((card) => (
    <Card
      id={card.code}
      key={uuid()}
      value={card.value}
      suit={card.suit}
      image={card.image}
    />
  ));

  return (
    <div className="cards">
      <div className="">
        <button className="draw-cards" onClick={() => drawCard()}>
          Draw Card
        </button>
      </div>
      <div ref={deckId}>{cards ? [cardComponents] : <p>Loading....</p>}</div>
    </div>
  );
}

export default Cards;
