import React from "react"
import { useDrag, useDrop } from "react-dnd"
import Draggable from "react-draggable"

const PlayCard = ({ index, card }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: "Card",
      card: card,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    // <Draggable>
    <li
      ref={drag}
      className="poke-card-game"
      key={index}
      id={index}
      //onClick={() => bringFront(index)}
    >
      <img
        src={card.imageUrl}
        draggable="false"
        alt={card.name}
        width="100px"
      />
      {/* <button onClick={() => playActivePkmn(card)}>Set Active Pkmn</button> */}
    </li>
    // </Draggable>
  )
}

export default PlayCard
