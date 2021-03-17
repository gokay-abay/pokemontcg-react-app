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
import Modal from "./Modal"
import Slider from "react-slick"
import { set } from "mongoose"
import Coin from "./Coin"

// const socket = io("http://localhost:4000/");
const socket = io("https://gentle-brushlands-61970.herokuapp.com")

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
  const [oppBench, setOppBench] = useState([])
  const [oppTrainer, setOppTrainer] = useState({})

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

  const [selectedCard, setSelectedCard] = useState({
    card: "",
    location: "",
    index: "",
    nestedIndex: "",
  })
  const [indexSelected, setIndexSelected] = useState(0)
  // const [hoverImage, setHoverImage] = useState("")
  const [activePkmn, setActivePkmn] = useState({
    pkmn: "",
    energies: [],
    evolution: [],
  })
  const [trainer, setTrainer] = useState({})
  const [benchPkmn, setBenchPkmn] = useState([])
  const [discardedPkmn, setDiscardedPkmn] = useState([])
  const [energy, setEnergy] = useState()
  const [evolutionCard, setEvolutionCard] = useState()

  // ============== EVENT EMITTERS =====================================//
  useEffect(() => {
    let mounted = true
    socket.emit("activePkmn", activePkmn)
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
    let mounted = true
    socket.emit("benchPkmn", benchPkmn)
    socket.on("backBenchPkmn", (cardArray) => {
      if (mounted) {
        setOppBench(cardArray)
      }
    })
  }, [benchPkmn])

  useEffect(() => {
    let mounted = true
    socket.emit("trainer", trainer)
    socket.on("backTrainer", (card) => {
      if (mounted) {
        setOppTrainer(card)
      }
    })
  }, [trainer])

  // ===========================================================//

  // console.log(selectedCard)
  // selected card can have a type
  const selectCard = (card, location, index, energyIndex) => {
    setSelectedCard({
      card: card,
      location: location,
      index: index,
      nestedIndex: energyIndex,
    })
    if (energy) {
      switch (location) {
        case "activePkmn":
        case "evolutionActive":
          let copyEnergies = activePkmn.energies
          copyEnergies.push(energy.card)
          setActivePkmn((prevState) => {
            return {
              ...prevState,
              energies: copyEnergies,
            }
          })
          socket.emit("activePkmn", card)
          break
        case "benchPkmn":
        case "evolutionBench":
          let copyBench = benchPkmn
          copyBench[index].energies.push(energy.card)
          setBenchPkmn(copyBench)
          socket.emit("benchPkmn", benchPkmn)
          break
        default:
          return
      }
      // get the card with index
      removeCardfromHand(energy.index)
      setEnergy()
    } else if (evolutionCard) {
      switch (location) {
        case "activePkmn":
        case "evolutionActive":
          let copyEvolution = activePkmn.evolution
          copyEvolution.push(evolutionCard.card)
          setActivePkmn((prevState) => {
            return {
              ...prevState,
              evolution: copyEvolution,
            }
          })
          socket.emit("activePkmn", activePkmn)
          break
        case "benchPkmn":
        case "evolutionBench":
          let copyBench = benchPkmn
          copyBench[index].evolution.push(evolutionCard.card)
          setBenchPkmn(copyBench)
          socket.emit("benchPkmn", benchPkmn)
          break
        default:
          return
      }
      removeCardfromHand(evolutionCard.index)
      setEvolutionCard()
    }
  }

  // SET ACTIVE PKMN
  const addActivePkmn = (card, location, index) => {
    if (location === "hand") {
      card = removeCardfromHand(index)
      setActivePkmn({ pkmn: card[0], energies: [], evolution: [] })
    } else if (location === "benchPkmn") {
      card = removeFromBench(index)
      const pkmnCard = card[0]
      card.shift()
      setActivePkmn({ pkmn: pkmnCard, energies: card })
    }
    // socket.emit("activePkmn", card);
  }

  // ADD PKMN TO BENCH
  const addBenchPkmn = (card, location, index) => {
    card = removeCardfromHand(index)
    setBenchPkmn([...benchPkmn, { pkmn: card[0], energies: [], evolution: [] }])
    socket.emit("benchPkmn", benchPkmn)
  }

  const switchPkmn = (index) => {
    let copyBench = benchPkmn
    let benchSelected = benchPkmn[index]
    let activeSelected = activePkmn

    setActivePkmn(benchSelected)
    copyBench.splice(index, 1)
    if (activeSelected.pkmn) {
      copyBench.push(activeSelected)
    }
    setBenchPkmn(copyBench)
    socket.emit("benchPkmn", benchPkmn)
    socket.emit("activePkmn", activePkmn)
  }

  const attachEnergy = (card, index) => {
    // when this fired prompt user to select another card
    // when clicked I can add onClick listeners to the cards
    // when event listeners fired we can get the card and attach the energy card to it
    // we need to store the selected energy card in a comp level state
    //
    setEnergy({ card: card, index: index })
  }

  const playTrainer = (card, index) => {
    card = removeCardfromHand(index)
    setTrainer(...card)
    socket.emit("trainer", trainer)
  }

  const evolvePkmn = (card, location, index, nestedIndex) => {
    // card = removeCardfromHand(index)
    // if (location === "")
    setEvolutionCard({ card: card, index: index })
  }

  const discard = (card, location, index, energyIndex) => {
    if (location === "activePkmn") {
      setDiscardedPkmn([card, ...activePkmn.energies, ...discardedPkmn])
      setActivePkmn({
        pkmn: "",
        energies: [],
      })
    } else if (location === "benchPkmn") {
      setDiscardedPkmn([card, ...benchPkmn[index]?.energies, ...discardedPkmn])
      removeFromBench(index)
    } else if (location === "hand") {
      setDiscardedPkmn([card, ...discardedPkmn])
      removeCardfromHand(index)
    } else if (location === "energyBench") {
      removeEnergyBench(index, energyIndex)
      setDiscardedPkmn([card, ...discardedPkmn])
    } else if (location === "energyActive") {
      removeEnergyActive(energyIndex)
      setDiscardedPkmn([card, ...discardedPkmn])
    } else if (location === "trainer") {
      setTrainer({})
      setDiscardedPkmn([card, ...discardedPkmn])
    } else if (location === "evolutionActive") {
      card = removeEvolutionActive(energyIndex)
      setDiscardedPkmn([...card, ...discardedPkmn])
    } else if (location === "evolutionBench") {
      card = removeEvolutionBench(index, energyIndex)
      setDiscardedPkmn([...card, ...discardedPkmn])
    }
  }

  const addCardToHand = (card) => {
    let copyHand = hand
    copyHand.push(card)
    setHand(copyHand)
  }

  const removeActivePkmn = () => {
    let copyActive = activePkmn
    setActivePkmn({
      pkmn: "",
      energies: [],
    })
    socket.emit("activePkmn", activePkmn)
    return [copyActive.pkmn, ...copyActive.energies]
  }

  const removeCardfromHand = (index) => {
    let copyHand = hand
    const removedCard = copyHand.splice(index, 1)
    setHand(copyHand)
    return removedCard
  }

  const removeFromBench = (index) => {
    let copyBench = benchPkmn
    const removedCards = copyBench.splice(index, 1)
    setBenchPkmn(copyBench)
    socket.emit("benchPkmn", benchPkmn)
    return [removedCards[0].pkmn, ...removedCards[0].energies]
  }

  const removeTrainer = (card) => {
    setTrainer({})
    return [card]
  }

  const removeEnergyBench = (index, energyIndex) => {
    let copyBench = benchPkmn
    const removedEnergy = copyBench[index].energies.splice(energyIndex, 1)
    setBenchPkmn(copyBench)
    socket.emit("benchPkmn", benchPkmn)
    return removedEnergy
  }

  const removeEnergyActive = (energyIndex) => {
    let active = activePkmn
    const removedEnergy = active.energies.splice(energyIndex, 1)
    setActivePkmn(active)
    socket.emit("activePkmn", activePkmn)
    return removedEnergy
  }

  const removeEvolutionActive = (evolutionIndex) => {
    // remove evo active
    let active = activePkmn
    const removedEvo = active.evolution.splice(evolutionIndex, 1)
    setActivePkmn(active)
    socket.emit("activePkmn", activePkmn)
    return removedEvo
  }

  const removeEvolutionBench = (index, evolutionIndex) => {
    // remove evo bench
    let copyBench = benchPkmn
    const removedEvo = copyBench[index].evolution.splice(evolutionIndex, 1)
    setBenchPkmn(copyBench)
    socket.emit("benchPkmn", benchPkmn)
    return removedEvo
  }

  const removeFromDeck = (index) => {
    let copyDeck = localDeck.cards
    const removedCard = copyDeck.splice(index, 1)
    setLocalDeck((prevState) => {
      return {
        ...prevState,
        cards: copyDeck,
      }
    })
    return removedCard
  }

  const returnToHand = (card, location, index, nestedIndex) => {
    if (location === "benchPkmn") {
      card = removeFromBench(index)
      socket.emit("benchPkmn", benchPkmn)
    } else if (location === "activePkmn") {
      card = removeActivePkmn()
    } else if (location === "energyBench") {
      card = removeEnergyBench(index, nestedIndex)
    } else if (location === "energyActive") {
      card = removeEnergyActive(nestedIndex)
    } else if (location === "trainer") {
      card = removeTrainer(card)
    } else if (location === "evolutionActive") {
      card = removeEvolutionActive(nestedIndex)
    } else if (location === "evolutionBench") {
      card = removeEvolutionBench(index, nestedIndex)
    }
    setHand([...hand, ...card])
  }

  const returnToDeck = (card, location, index, nestedIndex) => {
    if (location === "benchPkmn") {
      card = removeFromBench(index)
    } else if (location === "activePkmn") {
      card = removeActivePkmn()
    } else if (location === "energyBench") {
      card = removeEnergyBench(index, nestedIndex)
    } else if (location === "energyActive") {
      card = removeEnergyActive(nestedIndex)
    } else if (location === "hand") {
      card = removeCardfromHand(index)
    } else if (location === "trainer") {
      card = removeTrainer(card)
    } else if (location === "evolutionActive") {
      card = removeEvolutionActive(nestedIndex)
    } else if (location === "evolutionBench") {
      card = removeEvolutionBench(index, nestedIndex)
    }

    const newDeck = [...card, ...localDeck.cards]
    setLocalDeck((prevState) => {
      return {
        ...prevState,
        cards: newDeck,
      }
    })
  }

  const addToHandRemoveFromLocation = (cards) => {
    // look at the cards inside the deck and pick cards
    // Opens up a modal that shows the cards in the deck
    // each card can be clicked to return to hand
    let copyHand = hand

    if (modalLocation === "deck") {
      let copyDeck = localDeck.cards
      hand.push(cards.card)
      const removedCards = copyDeck.splice(cards.index, 1)
      setLocalDeck((prevState) => {
        return {
          ...prevState,
          cards: copyDeck,
        }
      })
    } else if (modalLocation === "discard") {
      let copyDiscard = discardedPkmn
      hand.push(cards.card)
      const removedCards = copyDiscard.splice(cards.index, 1)
      setDiscardedPkmn(copyDiscard)
    }
    setHand(copyHand)
  }

  // =========================== MODAL LOGIC ========================================

  const [modalCards, setModalCards] = useState([])
  const [modalLocation, setModalLocation] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [pickedModal, setPickedModal] = useState([])

  const modalClicked = (location) => {
    if (location === "deck") {
      setModalCards(localDeck.cards)
      setModalLocation("deck")
    } else if (location === "discard") {
      setModalCards(discardedPkmn)
      setModalLocation("discard")
    }
    setModalOpen(true)
  }

  const putDeckCardsInOrder = () => {
    // allow players to reorder the deck
  }
  // ===============================================================================

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
    setDiscardedPkmn([])
    setActivePkmn({})
    setBenchPkmn([])
    setTrainer({})
    setSelectedCard({})
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

  // I need input to ask the user which deck they want
  // get the deck. feed it into the functions.

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="side-by-side">
      <div className="side-panel">
        <SidePanel
          card={selectedCard}
          index={indexSelected}
          setActive={addActivePkmn}
          setEvolve={evolvePkmn}
          setBench={addBenchPkmn}
          setTrainer={playTrainer}
          setDiscard={discard}
          setSwitch={switchPkmn}
          setEnergy={attachEnergy}
          isActive={activePkmn.pkmn}
          returnToHand={returnToHand}
          returnToDeck={returnToDeck}
        />
        <div className="btn-group">
          <button onClick={draw}>Draw</button>
          <button onClick={shuffle}>Shuffle</button>
          <button onClick={restart}>Restart</button>
        </div>
      </div>

      <div className="playmat">
        <Modal
          clicked={modalOpen}
          cards={modalCards}
          close={() => setModalOpen(false)}
          location={modalLocation}
          addToHand={(cards) => {
            addToHandRemoveFromLocation(cards)
          }}
        />
        <div className="hand-placeholder">
          {hand &&
            hand.map((card, index) => (
              <img
                width="75px"
                src={card.imageUrl}
                alt=""
                onClick={() => {
                  setIndexSelected(index)
                  selectCard(card, "hand", index)
                }}
              />
            ))}
        </div>

        {/* PLAYER ACTIVE */}
        <div className="active-pokemon1-placeholder">
          {/* {itemDropped && <PlayCard card={draggedCard.card} />} */}
          {activePkmn && (
            <div>
              {activePkmn.energies &&
                activePkmn.energies.map((energy, energyIndex) => (
                  <img
                    className="attached-energy"
                    style={{
                      left: (energyIndex + 1) * 15,
                      zIndex: (energyIndex + 1) * -5,
                    }}
                    width="100px"
                    src={energy.imageUrl}
                    onClick={() =>
                      selectCard(energy, "energyActive", 0, energyIndex)
                    }
                  />
                ))}
              {activePkmn.evolution?.length > 0 ? (
                <img
                  width="100px"
                  style={{ zIndex: 50 }}
                  src={
                    activePkmn.evolution.length > 0 &&
                    activePkmn.evolution[activePkmn.evolution.length - 1]
                      ?.imageUrl
                  }
                  alt=""
                  onClick={() =>
                    selectCard(
                      activePkmn.evolution[activePkmn.evolution.length - 1],
                      "evolutionActive",
                      0,
                      activePkmn.evolution.length - 1
                    )
                  }
                />
              ) : (
                <img
                  width="100px"
                  style={{ zIndex: 50 }}
                  src={activePkmn.pkmn && activePkmn.pkmn.imageUrl}
                  alt=""
                  onClick={() => selectCard(activePkmn.pkmn, "activePkmn", 0)}
                />
              )}
            </div>
          )}
        </div>

        {/* PLAYER BENCH */}
        <div className="bench1-placeholder">
          {/* {itemDropped && <PlayCard card={draggedCard.card} />} */}
          {benchPkmn &&
            benchPkmn.map((card, index) => (
              <div style={{ position: "relative", margin: 20 }}>
                {card.evolution?.length > 0 ? (
                  <img
                    key={index}
                    width="60px"
                    src={card.evolution[card.evolution.length - 1].imageUrl}
                    alt=""
                    onClick={() => {
                      setIndexSelected(index)
                      selectCard(
                        card.evolution[card.evolution.length - 1],
                        "evolutionBench",
                        index,
                        card.evolution.length - 1
                      )
                    }}
                  />
                ) : (
                  <img
                    key={index}
                    width="60px"
                    src={card.pkmn.imageUrl}
                    alt=""
                    onClick={() => {
                      setIndexSelected(index)
                      selectCard(card.pkmn, "benchPkmn", index)
                    }}
                  />
                )}
                {card.energies &&
                  card.energies.map((energy, energyIndex) => (
                    <img
                      className="attached-energy"
                      style={{
                        left: (energyIndex + 1) * 10,
                        zIndex: (energyIndex + 1) * -5,
                      }}
                      width="60px"
                      src={energy.imageUrl}
                      onClick={() =>
                        selectCard(energy, "energyBench", index, energyIndex)
                      }
                    />
                  ))}
              </div>
            ))}
        </div>

        {/* PLAYER TRAINER */}
        <div className="player-trainer-container">
          <img
            width="80px"
            src={trainer && trainer.imageUrl}
            alt=""
            onClick={() => selectCard(trainer, "trainer", 0)}
          />
        </div>

        {/* OPPONENT ACTIVE */}
        <div className="active-pokemon2-placeholder">
          {oppActive.energies &&
            oppActive.energies.map((energy, energyIndex) => (
              <img
                className="attached-energy"
                style={{
                  left: (energyIndex + 1) * 15,
                  zIndex: (energyIndex + 1) * -5,
                }}
                width="100px"
                src={energy.imageUrl}
                onClick={() => selectCard(energy, "opponent", 0, energyIndex)}
              />
            ))}
          {oppActive.evolution?.length > 0 ? (
            <img
              width="100px"
              style={{ zIndex: 50 }}
              src={
                oppActive.evolution.length > 0 &&
                oppActive.evolution[oppActive.evolution.length - 1]?.imageUrl
              }
              alt=""
              onClick={() =>
                selectCard(
                  oppActive.evolution[oppActive.evolution.length - 1],
                  "opponent",
                  0,
                  oppActive.evolution.length - 1
                )
              }
            />
          ) : (
            <img
              src={oppLoaded ? oppActive.pkmn?.imageUrl : ""}
              width="100px"
              style={{ zIndex: 50 }}
              alt=""
              onClick={() => selectCard(oppActive.pkmn, "opponent", 0)}
            />
          )}
        </div>

        {/* OPPONENT BENCH */}
        <div className="bench2-placeholder">
          {oppBench &&
            oppBench.map((card, index) => (
              <div style={{ position: "relative", margin: 20 }}>
                {card.evolution?.length > 0 ? (
                  <img
                    key={index}
                    width="60px"
                    src={card.evolution[card.evolution.length - 1].imageUrl}
                    alt=""
                    onClick={() => {
                      setIndexSelected(index)
                      selectCard(
                        card.evolution[card.evolution.length - 1],
                        "opponent",
                        index,
                        card.evolution.length - 1
                      )
                    }}
                  />
                ) : (
                  <img
                    key={index}
                    width="60px"
                    src={card.pkmn.imageUrl}
                    alt=""
                    onClick={() => {
                      selectCard(card.pkmn, "opponent", index)
                    }}
                  />
                )}
                {card.energies &&
                  card.energies.map((energy, energyIndex) => (
                    <img
                      className="attached-energy"
                      style={{
                        left: (energyIndex + 1) * 10,
                        zIndex: (energyIndex + 1) * -5,
                      }}
                      width="60px"
                      src={energy.imageUrl}
                      onClick={() =>
                        selectCard(energy, "opponent", index, energyIndex)
                      }
                    />
                  ))}
              </div>
            ))}
        </div>

        <div className="opponent-trainer-container">
          <img
            width="80px"
            src={oppTrainer && oppTrainer.imageUrl}
            alt=""
            onClick={() => selectCard(oppTrainer, "opponent", 0)}
          />
        </div>

        <div className="discard-pile-placeholder">
          {discardedPkmn[0] && (
            <img
              width="80px"
              src={discardedPkmn[0].imageUrl}
              alt=""
              onClick={() => {
                selectCard(discardedPkmn[0], "discardedPkmn", "discardPile")
                modalClicked("discard")
              }}
            />
          )}
        </div>
        <div className="coin-container">
          <Coin />
        </div>
        <img
          id="card-back-img"
          draggable="false"
          src={pokeCardBack}
          alt="pokecard"
          width="100px"
          onClick={() => modalClicked("deck")}
        />

        {/* <div className="hand-div">
        <ul className="list" id="hand-ul"> */}
        {/* {hand.map((card, index) => (
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
        {/* </li> */}
        {/* // </Draggable> */}
        {/* ))} */}
        {/* </ul>
      </div> */}
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
