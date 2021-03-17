import { Group } from "@material-ui/icons"
import React from "react"
import { pokeCardBack } from "../constants/images"

// what props this will take
const SidePanel = ({
  card,
  index,
  setActive,
  setEvolve,
  setBench,
  setTrainer,
  setSwitch,
  setDiscard,
  setEnergy,
  isActive,
  returnToHand,
  returnToDeck,
  openModal,
}) => {
  // function that checks types
  // 1. if active pokemon place it to active pokemon div

  const pokemon = (
    <>
      {card.card.subtype === "Basic" ? (
        <>
          {!isActive && card.location === "hand" && (
            <button
              class="btn btn-light"
              onClick={() => setActive(card.card, card.location, card.index)}
            >
              Active Pkmn
            </button>
          )}
          {card.location === "hand" && (
            <button
              class="btn btn-light"
              onClick={() => setBench(card.card, card.location, card.index)}
            >
              Bench
            </button>
          )}
        </>
      ) : (
        <>
          {card.location === "hand" && (
            <button
              class="btn btn-light"
              onClick={() =>
                setEvolve(
                  card.card,
                  card.location,
                  card.index,
                  card.nestedIndex
                )
              }
            >
              Evolve
            </button>
          )}
        </>
      )}
      {card.location ===
        (card.location === "benchPkmn" ? "benchPkmn" : "evolutionBench") && (
        <button class="btn btn-light" onClick={() => setSwitch(index)}>
          Switch with Active
        </button>
      )}
      <button
        class="btn btn-light"
        onClick={() => setDiscard(card.card, card.location, card.index)}
      >
        Discard
      </button>
    </>
  )

  const energy = (
    <>
      <button class="btn btn-light" onClick={() => setEnergy(card.card, index)}>
        Attach to Pkmn
      </button>
      <button
        class="btn btn-light"
        onClick={() =>
          setDiscard(card.card, card.location, card.index, card.nestedIndex)
        }
      >
        Discard
      </button>
    </>
  )

  const trainer = (
    <>
      {card.location === "hand" && (
        <button
          class="btn btn-light"
          onClick={() => setTrainer(card.card, card.index)}
        >
          Play
        </button>
      )}
      <button
        class="btn btn-light"
        onClick={() =>
          setDiscard(card.card, card.location, card.index, card.nestedIndex)
        }
      >
        Discard
      </button>
    </>
  )

  const cardTypes = () => {
    switch (card.card?.supertype) {
      case "Pokémon":
        return pokemon
      case "Energy":
        return energy
      case "Trainer":
        return trainer
      default:
        break
    }
  }

  return (
    <div className="side-panel-container">
      <div className="pokecard-back">
        <img
          width="100%"
          src={card.card?.imageUrl ? card.card.imageUrl : pokeCardBack}
          alt={card.card?.name || "deck"}
        />
      </div>
      {card.location !== "opponent" && (
        <>
          <div className="btn-group">
            {card.location === "deck" ? (
              <button
                className="btn btn-light"
                onClick={() => openModal("deck")}
              >
                Search Deck
              </button>
            ) : (
              <>
                {cardTypes()}
                {card.location !== "hand" && (
                  <button
                    class="btn btn-light"
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
                  class="btn btn-light"
                  onClick={() =>
                    returnToDeck(
                      card.card,
                      card.location,
                      card.index,
                      card.nestedIndex
                    )
                  }
                >
                  Return to Deck
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SidePanel
