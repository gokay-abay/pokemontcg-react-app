import React from "react"
import { pokeCardBack } from "../constants/images"

// what props this will take
const SidePanel = ({
  card,
  index,
  setActive,
  hoverImage,
  setBench,
  setSwitch,
  setDiscard,
}) => {
  console.log(card)
  // function that checks types
  // 1. if active pokemon place it to active pokemon div
  const pokemon = (
    <div className="btn-group">
      <button onClick={() => setActive(card)}>Active Pkmn</button>
      <button onClick={() => setBench(card)}>Bench</button>
      <button onClick={() => setSwitch(index)}>Switch</button>
      <button onClick={() => setDiscard(card)}>Discard</button>
    </div>
  )

  const energy = (
    <div className="btn-group">
      <button>Attach to Pkmn</button>
      <button>Discard</button>
    </div>
  )

  const cardTypes = () => {
    switch (card.supertype) {
      case "Pokémon":
        return pokemon
      case "Energy":
        return energy
      default:
        break
    }
  }

  return (
    <div className="side-panel-container">
      <div className="pokecard-back">
        <img
          width="100%"
          src={card.imageUrl ? card.imageUrl : hoverImage}
          //   src={hoverImage !== "" ? hoverImage : card.imageUrl}
          alt=""
        />
      </div>
      {cardTypes()}
      {/* <div className="btn-group">
        <button>PlaceHolder</button>
        <button>PlaceHolder</button>
        <button>PlaceHolder</button>
      </div> */}
    </div>
  )
}

export default SidePanel
