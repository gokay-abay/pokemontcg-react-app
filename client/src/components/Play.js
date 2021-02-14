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
import PlayCard from "./PlayCard"
import SidePanel from "./SidePanel"
import { pokeCardBack } from "../constants/images"

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

  const [oppActive, setOppActive] = useState("")
  const [oppLoaded, setOppLoaded] = useState(false)

  const [socketId, setSocketId] = useState("")

  // ====================== REACT DND ===========================

  // Droppable item state variable
  // const [draggedCard, setDraggedCard] = useState({})
  // const [itemDropped, setItemDropped] = useState(false)

  // Droppable Zone

  // const [{ isOver, didDrop }, drop] = useDrop({
  //   accept: "Card",
  //   drop: (item, monitor) => {
  //     setDraggedCard(item)
  //     setItemDropped(true)
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     didDrop: monitor.didDrop(),
  //   }),
  // })

  // console.log(didDrop)

  // ==========================================================

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

  // ==================== SOCKET IO ACTIVE PKMN SET =========================

  // useEffect(() => {
  //   let mounted = true
  //   socket.on("backActivePkmn", (card) => {
  //     if (mounted) {
  //       // if (socketId !== servSocketId) {
  //       setOppActive(card)
  //       setOppLoaded(true)
  //       // }
  //     }
  //   })
  //   return () => (mounted = false)
  // }, [activePkmn])

  // ====================  ========================= =========================

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

  // ====================== SIDE PANEL LOGIC ===========================

  const [selectedCard, setSelectedCard] = useState({})
  const [indexSelected, setIndexSelected] = useState(0)
  // const [hoverImage, setHoverImage] = useState("")
  const [activePkmn, setActivePkmn] = useState({})
  const [benchPkmn, setBenchPkmn] = useState([])
  const [discardedPkmn, setDiscardedPkmn] = useState([])

  console.log(indexSelected)

  // console.log(selectedCard)
  const selectCard = (card) => {
    setSelectedCard(card)
  }

  const addActivePkmn = (card) => {
    let copyBench = benchPkmn
    for (let j = 0; j < copyBench.length; j++) {
      if (card.id === copyBench[j].id) {
        copyBench.splice(j, 1)
        setBenchPkmn(copyBench)
        setActivePkmn(card)
        return
      }
    }
    let copyHand = hand
    for (let j = 0; j < copyHand.length; j++) {
      if (card.id === copyHand[j].id) {
        copyHand.splice(j, 1)
        setHand(copyHand)
        setActivePkmn(card)
        return
      }
    }
  }

  const addBenchPkmn = (card) => {
    let copyHand = hand
    for (let j = 0; j < hand.length; j++) {
      if (card.id === hand[j].id) {
        copyHand.splice(j, 1)
        setHand(copyHand)
        setBenchPkmn([...benchPkmn, card])
        return
      }
    }
  }

  const switchPkmn = (index) => {
    let copyBench = benchPkmn
    let benchSelected = benchPkmn[index]
    let activeSelected = activePkmn

    setActivePkmn(benchSelected)
    copyBench.splice(index, 1)
    copyBench.push(activeSelected)
    setBenchPkmn(copyBench)
  }

  const discard = (card) => {
    if (card.id === activePkmn.id) {
      setActivePkmn({})
    }
    setDiscardedPkmn([card, ...discardedPkmn])
  }

  //console.log(benchPkmn)
  // ===================================================================

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

  // const playActivePkmn = (card) => {
  //   setActivePkmn(card)
  //   socket.emit("activePkmn", card)
  // }

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
      <div className="hand-placeholder">
        {hand &&
          hand.map((card, index) => (
            <img
              width="75px"
              src={card.imageUrl}
              alt=""
              onClick={() => {
                setIndexSelected(index)
                setSelectedCard(card)
              }}
              // onMouseEnter={() => setHoverImage(activePkmn.imageUrl)}
              // onMouseLeave={() => setHoverImage("")}
            />
          ))}
      </div>
      <div className="bench1-placeholder">
        {/* {itemDropped && <PlayCard card={draggedCard.card} />} */}
        {benchPkmn &&
          benchPkmn.map((card, index) => (
            <img
              width="80px"
              src={card.imageUrl}
              alt=""
              onClick={() => {
                setIndexSelected(index)
                setSelectedCard(card)
              }}
              // onMouseEnter={() => setHoverImage(activePkmn.imageUrl)}
              // onMouseLeave={() => setHoverImage("")}
            />
          ))}
      </div>
      <div className="bench2-placeholder">Bench</div>
      <div className="active-pokemon1-placeholder">
        {/* {itemDropped && <PlayCard card={draggedCard.card} />} */}
        {activePkmn && (
          <img
            width="100%"
            src={activePkmn.imageUrl}
            alt=""
            onClick={() => setSelectedCard(activePkmn)}
            // onMouseEnter={() => setHoverImage(activePkmn.imageUrl)}
            // onMouseLeave={() => setHoverImage("")}
          />
        )}
      </div>
      <div className="active-pokemon2-placeholder">
        <img
        // src={oppLoaded ? oppActive.imageUrl : ""}
        // draggable="false"
        // // alt={card.name}
        // width="100px"
        />
      </div>
      <div className="discard-pile-placeholder">
        {discardedPkmn[0] && (
          <img
            width="80px"
            src={discardedPkmn[0].imageUrl}
            alt=""
            onClick={() => setSelectedCard(discardedPkmn[0])}
            // onMouseEnter={() => setHoverImage(activePkmn.imageUrl)}
            // onMouseLeave={() => setHoverImage("")}
          />
        )}
      </div>
      <div className="side-panel">
        <SidePanel
          card={selectedCard}
          index={indexSelected}
          setActive={addActivePkmn}
          setBench={addBenchPkmn}
          setDiscard={discard}
          setSwitch={switchPkmn}
          // hoverImage={hoverImage}
        />
      </div>
      <img
        id="card-back-img"
        draggable="false"
        src={pokeCardBack}
        alt="pokecard"
        width="100px"
      />
      <button onClick={restart}>Restart</button>
      <button>Set Active Pkmn</button>
      <button onClick={createGame}>Create Game</button>
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={draw}>Draw</button>

      <div className="hand-div">
        <ul className="list" id="hand-ul">
          {hand.map((card, index) => (
            // <Draggable>
            // <PlayCard
            //   index={index}
            //   card={card}
            //   onClick={}
            // />
            <li
              className="poke-card-game"
              key={index}
              id={index}
              onClick={() => setSelectedCard(card)}
              // onClick={() => bringFront(index)}
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
