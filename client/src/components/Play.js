import React, { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { getAllDecks, getDeck } from "../actions/deck"
import Draggable from "react-draggable"
import { io } from "socket.io-client"
import PropTypes from "prop-types"
// REACT DND
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const socket = io("http://localhost:4000/")

const Play = ({
  getAllDecks,
  decks,
  deck,
  getDeck,
  deckLoading,
  decksLoading,
  isAuthenticated,
}) => {
  // ask user to select a deck
  // give them a dropdown with their decks

  // get user decks
  // give user option to select from the menu
  // once clicked we fire getDeck with the selected option's id
  // let user know the it's ready to play

  const [localDeck, setLocalDeck] = useState({
    cards: [],
    name: "",
    id: "",
  })

  const [hand, setHand] = useState([])
  const [zValue, setZValue] = useState(1)
  const [copyDeck, setCopyDeck] = useState({})

  const [activePkmn, setActivePkmn] = useState({})
  const [oppActive, setOppActive] = useState("")
  const [oppLoaded, setOppLoaded] = useState(false)

  const [socketId, setSocketId] = useState("")

  // useEffect(() => {
  // }, [])

  // Two cards sent. player will send their active pokemon and that will be displayed on the opponents other player card

  // save socket id to conditionally render cards

  useEffect(() => {
    let mounted = true
    socket.on("resSocketId", (id) => {
      if (mounted) {
        setSocketId(id)
      }
    })
    return () => (mounted = false)
  }, [])

  const createGame = () => {
    socket.emit("createGame")
  }

  // I send card with my socket id to server
  // Server sends me back a card with a socket id
  // if that socket id matches with my socket id that means it's my card
  // and I don't render it.
  // if the socket id is not mine it means it's another players card

  useEffect(() => {
    let mounted = true
    socket.on("backActivePkmn", (card) => {
      if (mounted) {
        // if (socketId !== servSocketId) {
        setOppActive(card)
        setOppLoaded(true)
        // }
      }
    })
    return () => (mounted = false)
  }, [activePkmn])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deckLoading) {
        setLocalDeck({
          cards: deck.cards,
          name: deck.name,
          id: deck._id,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [deck])

  const shuffle = () => {
    let shuffledDeck = localDeck.cards
    if (shuffledDeck.length > 0) {
      for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor(Math.random() * shuffledDeck.length)
        let location2 = Math.floor(Math.random() * shuffledDeck.length)
        let temp = shuffledDeck[location1]
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

  // draws the top card from the deck
  const draw = () => {
    let drawnDeck = localDeck.cards
    if (drawnDeck.length > 0) {
      let drawnCard = drawnDeck.shift()
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
    setZValue(1)
    getDeck(localDeck.id)
  }

  // Brings the card front on click
  // get the element by its id and then increase its z-index by 1
  const bringFront = (cardId) => {
    let elem = document.getElementById(cardId)
    setZValue(zValue + 1)
    elem.style.zIndex = zValue
  }

  const playActivePkmn = (card) => {
    setActivePkmn(card)
    socket.emit("activePkmn", card)
  }

  const playEnergy = (card) => {}
  //   const handleOptionChange = (e) => {
  //     setCopyDeck(e.target.value)
  //     console.log(copyDeck)
  //   }

  //   const onSubmit = async (e) => {
  //     e.preventDefault()
  //     const timer = setTimeout(() => {
  //       if (deck != null) {
  //         setLocalDeck({
  //           cards: copyDeck.cards,
  //           name: copyDeck.name,
  //           id: copyDeck._id,
  //         })
  //       }
  //     }, 500)
  //   }

  // I need input to ask the user which deck they want
  // get the deck. feed it into the functions.

  function dragoverHandler(ev) {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "move"
  }
  function dropHandler(ev) {
    ev.preventDefault()
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("application/my-app")
    ev.target.appendChild(document.getElementById(data))
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="playmat">
      {/* <form onSubmit={onSubmit}>
        <select
          className="form-control select-item"
          value={deck}
          onChange={handleOptionChange}
        >
          <option>Choose Deck..</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck} selected>
              {deck.name}
            </option>
          ))}
        </select>
        <input className="btn btn-primary" type="submit" value="Select" />
      </form> */}
      <div ref={drop} className="bench1-placeholder">
        Bench
      </div>
      <div className="bench2-placeholder">Bench</div>
      <div
        className="active-pokemon1-placeholder"
        onDrop={dropHandler}
        onDragOver={dragoverHandler}
      >
        Active Pokemon
      </div>
      <div className="active-pokemon2-placeholder">
        <img
          src={oppLoaded ? oppActive.imageUrl : ""}
          draggable="false"
          // alt={card.name}
          width="100px"
        />
      </div>
      <div className="discard-pile-placeholder">Discard Pile</div>
      <img
        id="card-back-img"
        draggable="false"
        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420,strp/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xNDIwIiwicGF0aCI6IlwvZlwvNGY3NzA1ZWMtOGM0OS00ZWVkLWE1NmUtYzIxZjM5ODUyNTRjXC9kYWg0M2N5LWE4ZTEyMWNiLTkzNGEtNDBmNi05N2M3LWZhMmQ3NzEzMGRkNS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6Au-hxTt7FuZ5paCMWMJrAiCi-ClaG35bEG2TgGg0VE"
        alt="pokecard"
        width="100px"
      />
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={draw}>Draw</button>
      <button onClick={restart}>Restart</button>
      <button>Set Active Pkmn</button>
      <button onClick={createGame}>Create Game</button>

      <div className="hand-div">
        <ul className="list" id="hand-ul">
          {hand.map((card, index) => (
            <Draggable>
              <li
                className="poke-card-game"
                key={index}
                id={index}
                onClick={() => bringFront(index)}
              >
                <img
                  src={card.imageUrl}
                  draggable="false"
                  alt={card.name}
                  width="100px"
                />
                <button onClick={() => playActivePkmn(card)}>
                  Set Active Pkmn
                </button>
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
  getAllDecks: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
  deckLoading: state.deck.deckLoading,
  isAuthenticated: state.auth.isAuthenticated,
  decks: state.deck.decks,
  decksLoading: state.deck.decksLoading,
})

export default connect(mapStateToProps, { getDeck, getAllDecks })(Play)
