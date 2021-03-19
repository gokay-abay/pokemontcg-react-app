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
  isTrainerPlayed,
  returnToHand,
  returnToDeck,
  openModal,
  cardReset,
}) => {
  // function that checks types
  // 1. if active pokemon place it to active pokemon div

  const pokemon = (
    <>
      {card?.card.subtype === "Basic" ? (
        <>
          {!isActive && card.location === "hand" && (
            <button
              className="btn btn-light"
              onClick={() => {
                setActive(card.card, card.location, card.index)
                cardReset({
                  card: "",
                  location: "",
                  index: "",
                  nestedIndex: "",
                })
              }}
            >
              Active Pkmn
            </button>
          )}
          {card?.location === "hand" && (
            <button
              className="btn btn-light"
              onClick={() => {
                setBench(card.card, card.location, card.index)
                cardReset({
                  card: "",
                  location: "",
                  index: "",
                  nestedIndex: "",
                })
              }}
            >
              Bench
            </button>
          )}
        </>
      ) : (
        <>
          {card?.location === "hand" && (
            <button
              className="btn btn-light"
              onClick={() => {
                setEvolve(
                  card.card,
                  card.location,
                  card.index,
                  card.nestedIndex
                )
              }}
            >
              Evolve
            </button>
          )}
        </>
      )}
      {card?.location ===
        (card?.location === "benchPkmn" ? "benchPkmn" : "evolutionBench") && (
        <button
          className="btn btn-light"
          onClick={() => {
            setSwitch(index)
            cardReset({
              card: "",
              location: "",
              index: "",
              nestedIndex: "",
            })
          }}
        >
          Switch with Active
        </button>
      )}
    </>
  )

  const energy = (
    <>
      <button
        className="btn btn-light"
        onClick={() => setEnergy(card.card, index)}
      >
        Attach to Pkmn
      </button>
    </>
  )

  const trainer = (
    <>
      {card?.location === "hand" && Object.keys(isTrainerPlayed).length === 0 && (
        <button
          className="btn btn-light"
          onClick={() => {
            setTrainer(card.card, card.index)
            cardReset({
              card: "",
              location: "",
              index: "",
              nestedIndex: "",
            })
          }}
        >
          Play
        </button>
      )}
    </>
  )

  const cardTypes = () => {
    switch (card?.card.supertype) {
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
          src={card?.card.imageUrl ? card.card.imageUrl : pokeCardBack}
          alt={card?.card?.name || "deck"}
        />
      </div>
      {card?.location !== "opponent" && (
        <>
          <div className="btn-group">
            {card?.location === "deck" ? (
              <button
                className="btn btn-light"
                onClick={() => openModal("deck")}
              >
                Search Deck
              </button>
            ) : (
              <>
                {cardTypes()}
                {card?.card && (
                  <button
                    className="btn btn-light"
                    onClick={() => {
                      setDiscard(
                        card.card,
                        card.location,
                        card.index,
                        card.nestedIndex
                      )
                      cardReset({
                        card: "",
                        location: "",
                        index: "",
                        nestedIndex: "",
                      })
                    }}
                  >
                    Discard
                  </button>
                )}
                {card?.location !== "hand" && card?.card && (
                  <button
                    className="btn btn-light"
                    onClick={() => {
                      returnToHand(
                        card.card,
                        card.location,
                        card.index,
                        card.nestedIndex
                      )
                      cardReset({
                        card: "",
                        location: "",
                        index: "",
                        nestedIndex: "",
                      })
                    }}
                  >
                    Return to Hand
                  </button>
                )}
                {card?.card && (
                  <>
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        returnToDeck(
                          card.card,
                          card.location,
                          card.index,
                          card.nestedIndex
                        )
                        cardReset({
                          card: "",
                          location: "",
                          index: "",
                          nestedIndex: "",
                        })
                      }}
                    >
                      Return to Deck
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SidePanel
