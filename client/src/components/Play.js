import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { getDeck } from "../actions/deck"
import Draggable from "react-draggable"

import PropTypes from "prop-types"

const Play = ({ deck, getDeck }) => {
  // ask user to select a deck
  // give them a dropdown with their decks

  const [localDeck, setLocalDeck] = useState({
    cards: [],
    name: "",
    id: "",
  })

  const [hand, setHand] = useState([])
  const [zValue, setZValue] = useState(1)

  useEffect(() => {
    getDeck("6012222733d68922ad93248f")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalDeck({
        cards: deck.cards,
        name: deck.name,
        id: deck._id,
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [deck])

  const shuffle = () => {
    var shuffledDeck = localDeck.cards
    if (shuffledDeck.length > 0) {
      for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor(Math.random() * shuffledDeck.length)
        var location2 = Math.floor(Math.random() * shuffledDeck.length)

        var temp = shuffledDeck[location1]

        shuffledDeck[location1] = shuffledDeck[location2]
        shuffledDeck[location2] = temp
      }
    }
    setLocalDeck((prevState) => {
      return {
        ...prevState,
        cards: shuffledDeck,
      }
    })
  }

  const draw = () => {
    // draws the top card from the deck
    var drawnDeck = localDeck.cards

    if (drawnDeck.length > 0) {
      var drawnCard = drawnDeck.shift()

      setLocalDeck((prevState) => {
        return {
          ...prevState,
          cards: drawnDeck,
        }
      })
      setHand([...hand, drawnCard])
    }
  }

  const restart = () => {
    setHand([])
    getDeck(localDeck.id)
  }

  const bringFront = (index) => {
    // get the element by its id and then increase its z-index by 1
    let elem = document.getElementById(index)
    setZValue(zValue + 1)
    elem.style.zIndex = zValue
    console.log("clicked")
  }

  // I need input to ask the user which deck they want
  // get the deck. feed it into the functions.

  return (
    <div className="playmat">
      <img
        //   style={styles}
        draggable="false"
        // id="absolute-image"
        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420,strp/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xNDIwIiwicGF0aCI6IlwvZlwvNGY3NzA1ZWMtOGM0OS00ZWVkLWE1NmUtYzIxZjM5ODUyNTRjXC9kYWg0M2N5LWE4ZTEyMWNiLTkzNGEtNDBmNi05N2M3LWZhMmQ3NzEzMGRkNS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6Au-hxTt7FuZ5paCMWMJrAiCi-ClaG35bEG2TgGg0VE"
        alt="pokecard"
        width="100px"
      />

      {/* <button className="btn btn-success m-2" onClick={this.shuffle}>
          Shuffle
          </button>
          <button className="btn btn-dark m-2" onClick={this.draw}>
          Draw
          </button>
          <ul className="list">
          {this.state.hand.map((card, index) => (
              <li className="poke-card" key={index} onClick={this.displayBtn}>
              <img src={card.imageUrl} alt={card.name} />
              </li>
              ))}
            </ul> */}
      {/* <Draggable></Draggable> */}
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={draw}>Draw</button>
      <button onClick={restart}>Restart</button>
      <div className="hand-div">
        <ul className="list" id="hand-ul">
          {hand.map((card, index) => (
            <Draggable>
              <li
                className="poke-card"
                key={index}
                id={index}
                onClick={() => bringFront(index)}
                value={index}
              >
                <img
                  src={card.imageUrl}
                  draggable="false"
                  alt={card.name}
                  width="100px"
                />
              </li>
            </Draggable>
          ))}
        </ul>
      </div>
    </div>
  )
}

Play.propTypes = {
  getDeck: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
})

export default connect(mapStateToProps, { getDeck })(Play)

//   const [localDeck, setLocalDeck] = useState({
//     cards: [],
//     name: "",
//     id: "",
//   })

//   const [position, setPosition] = useState({
//     activeDrags: 0,
//     deltaPosition: {
//       x: 0,
//       y: 0,
//     },
//   })

//   useEffect(() => {
//     getDeck("6012222733d68922ad93248f")
//   }, [])

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLocalDeck({
//         cards: deck.cards,
//         name: deck.name,
//         id: deck._id,
//       })
//     }, 500)
//     return () => clearTimeout(timer)
//   }, [deck])

//   const onDrag = (e, ui) => {
//     const { x, y } = position.deltaPosition
//     setPosition((prevState) => {
//       return {
//         ...prevState,
//         deltaPosition: { x: x + ui.deltaX, y: y + ui.deltaY },
//       }
//     })
//   }

//   const onStart = () => {
//     setPosition((prevState) => {
//       return {
//         ...prevState,
//         activeDrags: ++position.activeDrags,
//       }
//     })
//   }

//   const onStop = () => {
//     setPosition((prevState) => {
//       return {
//         ...prevState,
//         activeDrags: --position.activeDrags,
//       }
//     })
//   }

// const styles = {
//   transform: `translate(${position.deltaPosition.x}px, ${position.deltaPosition.y}px)`,
// }

//   const dragHandlers = { onStart: onStart, onStop: onStop }
//const { deltaPosition, controlledPosition } = this.state

// onDrag={onDrag} onStart={onStart} onStop={onStop}
