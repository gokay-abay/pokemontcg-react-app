import React from "react";
import { pokeCardBack } from "../constants/images";

// what props this will take
const SidePanel = ({
  card,
  index,
  setActive,
  hoverImage,
  setBench,
  setSwitch,
  setDiscard,
  setEnergy,
  isActive,
  returnToHand,
  returnToDeck,
}) => {
  // function that checks types
  // 1. if active pokemon place it to active pokemon div

  const pokemon = (
    <>
      {!isActive && (
        <button onClick={() => setActive(card.card, card.location, card.index)}>
          Active Pkmn
        </button>
      )}
      {card.location === "hand" && (
        <button onClick={() => setBench(card.card, card.location, card.index)}>
          Bench
        </button>
      )}
      {card.location === "benchPkmn" && (
        <button onClick={() => setSwitch(index)}>Switch with Active</button>
      )}
      <button onClick={() => setDiscard(card.card, card.location, card.index)}>
        Discard
      </button>
    </>
  );

  const energy = (
    <>
      <button onClick={() => setEnergy(card.card, index)}>
        Attach to Pkmn
      </button>
      <button
        onClick={() =>
          setDiscard(card.card, card.location, card.index, card.nestedIndex)
        }
      >
        Discard
      </button>
    </>
  );

  const cardTypes = () => {
    switch (card.card?.supertype) {
      case "Pokémon":
        return pokemon;
      case "Energy":
        return energy;
      default:
        break;
    }
  };

  return (
    <div className="side-panel-container">
      <div className="pokecard-back">
        <img
          width="100%"
          src={card.card?.imageUrl ? card.card.imageUrl : pokeCardBack}
          alt={card.card?.name}
        />
      </div>
      <div className="btn-group">
        {cardTypes()}
        {card.location !== "hand" && (
          <button
            onClick={() =>
              returnToHand(
                card.card,
                card.location,
                card.index,
                card.nestedIndex
              )
            }
          >
            Return to Hand
          </button>
        )}
        <button
          onClick={() =>
            returnToDeck(card.card, card.location, card.index, card.nestedIndex)
          }
        >
          Return to Deck
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
