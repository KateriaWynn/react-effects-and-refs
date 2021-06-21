import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import Card from './Card';
import './Cards.css';

/* Cards: uses the deck of cards API, allows drawing one card at a time. */

function Cards() {
  const BASE_URL = 'http://deckofcardsapi.com';
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const deckId = useRef();
  const timerRef = useRef(null);

  /* Will mount: load deck from API into state. */
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

  /* Will update: Draw a card via API, add card to state cards list */
  useEffect(() => {
    async function drawCard() {
      const id = deckId.current;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/deck/${id}/draw/?count=1`
        );

        const card = response.data.cards[0];
        const cardsRemaining = response.data.remaining;

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
          throw new Error('No cards remaining!');
        }
      } catch (err) {
        alert(err);
      }
    }
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw]);

  /* Toggle auto draw, page will draw one card every second. */
  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

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
        <button className="draw-cards" onClick={toggleAutoDraw}>
          {autoDraw ? 'Stop' : 'Start'} drawing
        </button>
      </div>
      <div ref={deckId}>{cards ? [cardComponents] : <p>Loading....</p>}</div>
    </div>
  );
}

export default Cards;
