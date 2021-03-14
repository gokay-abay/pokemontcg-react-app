import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getAllDecks, getDeck } from "../actions/deck";
import Draggable from "react-draggable";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
// REACT DND
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PlayCard from "./PlayCard";
import SidePanel from "./SidePanel";
import { pokeCardBack } from "../constants/images";

const socket = io("http://localhost:4000/");

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
  });

  const [hand, setHand] = useState([]);
  const [zValue, setZValue] = useState(1);

  const [oppActive, setOppActive] = useState("");
  const [oppLoaded, setOppLoaded] = useState(false);

  const [socketId, setSocketId] = useState("");

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
    let mounted = true;
    socket.on("resSocketId", (id) => {
      if (mounted) {
        setSocketId(id);
      }
    });
    return () => (mounted = false);
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

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
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [deck]);

  // ====================== SIDE PANEL LOGIC ===========================

  const [selectedCard, setSelectedCard] = useState({
    card: "",
    location: "",
    index: "",
    nestedIndex: "",
  });
  const [indexSelected, setIndexSelected] = useState(0);
  // const [hoverImage, setHoverImage] = useState("")
  const [activePkmn, setActivePkmn] = useState({
    pkmn: "",
    energies: [],
  });
  const [benchPkmn, setBenchPkmn] = useState([]);
  const [discardedPkmn, setDiscardedPkmn] = useState([]);
  const [energy, setEnergy] = useState();

  // console.log(selectedCard)
  // selected card can have a type
  const selectCard = (card, location, index, energyIndex) => {
    setSelectedCard({
      card: card,
      location: location,
      index: index,
      nestedIndex: energyIndex,
    });
    if (energy) {
      switch (location) {
        case "activePkmn":
          let copyEnergies = activePkmn.energies;
          copyEnergies.push(energy.card);
          setActivePkmn((prevState) => {
            return {
              ...prevState,
              energies: copyEnergies,
            };
          });
          break;
        case "benchPkmn":
          let copyBench = benchPkmn;
          copyBench[index].energies.push(energy.card);
          console.log(copyBench);
          setBenchPkmn(copyBench);
          break;
        default:
          return;
      }
      // get the card with index
      removeCardfromHand(energy.index);
      setEnergy();
    }
  };

  const addActivePkmn = (card) => {
    let copyBench = benchPkmn;
    for (let j = 0; j < copyBench.length; j++) {
      if (card.id === copyBench[j].pkmn.id) {
        copyBench.splice(j, 1);
        setBenchPkmn(copyBench);
        setActivePkmn((prevState) => {
          return {
            ...prevState,
            pkmn: card,
          };
        });
        return;
      }
    }
    let copyHand = hand;
    for (let j = 0; j < copyHand.length; j++) {
      if (card.id === copyHand[j].id) {
        copyHand.splice(j, 1);
        setHand(copyHand);
        setActivePkmn((prevState) => {
          return {
            ...prevState,
            pkmn: card,
          };
        });
        return;
      }
    }
  };

  const addBenchPkmn = (card) => {
    let copyHand = hand;
    for (let j = 0; j < hand.length; j++) {
      if (card.id === hand[j].id) {
        copyHand.splice(j, 1);
        setHand(copyHand);
        setBenchPkmn([...benchPkmn, { pkmn: card, energies: [] }]);
        return;
      }
    }
  };

  const switchPkmn = (index) => {
    let copyBench = benchPkmn;
    let benchSelected = benchPkmn[index];
    let activeSelected = activePkmn;

    setActivePkmn(benchSelected);
    copyBench.splice(index, 1);
    copyBench.push(activeSelected);
    setBenchPkmn(copyBench);
  };

  const attachEnergy = (card, index) => {
    // when this fired prompt user to select another card
    // when clicked I can add onClick listeners to the cards
    // when event listeners fired we can get the card and attach the energy card to it
    // we need to store the selected energy card in a comp level state
    //
    console.log(energy);
    setEnergy({ card: card, index: index });
  };

  const discard = (card, location, index, energyIndex) => {
    if (location === "activePkmn") {
      setDiscardedPkmn([card, ...activePkmn.energies, ...discardedPkmn]);
      setActivePkmn({
        pkmn: "",
        energies: [],
      });
    } else if (location === "benchPkmn") {
      setDiscardedPkmn([card, ...benchPkmn[index]?.energies, ...discardedPkmn]);
      removeFromBench(index);
    } else if (location === "hand") {
      setDiscardedPkmn([card, ...discardedPkmn]);
      removeCardfromHand(index);
    } else if (location === "energyBench") {
      removeEnergyBench(index, energyIndex);
      setDiscardedPkmn([card, ...discardedPkmn]);
    } else if (location === "energyActive") {
      removeEnergyActive(energyIndex);
      setDiscardedPkmn([card, ...discardedPkmn]);
    }
  };

  const addCardToHand = (card) => {
    let copyHand = hand;
    copyHand.push(card);
    setHand(copyHand);
  };

  const removeActivePkmn = () => {
    let copyActive = activePkmn;
    setActivePkmn({
      pkmn: "",
      energies: [],
    });
    return [copyActive.pkmn, ...copyActive.energies];
  };

  const removeCardfromHand = (index) => {
    let copyHand = hand;
    copyHand.splice(index, 1);
    setHand(copyHand);
  };

  const removeFromBench = (index) => {
    let copyBench = benchPkmn;
    const removedCards = copyBench.splice(index, 1);
    setBenchPkmn(copyBench);
    return [removedCards[0].pkmn, ...removedCards[0].energies];
  };

  const removeEnergyBench = (index, energyIndex) => {
    let copyBench = benchPkmn;
    const removedEnergy = copyBench[index].energies.splice(energyIndex, 1);
    setBenchPkmn(copyBench);
    return removedEnergy;
  };

  const removeEnergyActive = (energyIndex) => {
    console.log(energyIndex);
    let active = activePkmn;
    const removedEnergy = active.energies.splice(energyIndex, 1);
    setActivePkmn(active);
    return removedEnergy;
  };

  const removeAndAddToHand = (card, location, index, energyIndex) => {
    if (location === "benchPkmn") {
      card = removeFromBench(index);
    } else if (location === "activePkmn") {
      card = removeActivePkmn();
    } else if (location === "energyBench") {
      card = removeEnergyBench(index, energyIndex);
    } else if (location === "energyActive") {
      card = removeEnergyActive(energyIndex);
    }
    setHand([...hand, ...card]);
  };

  const returnCardToDeck = (card, location, index, energyIndex) => {
    // select a card and put it back to deck
    if (location === "benchPkmn") {
      card = removeFromBench(index);
    } else if (location === "activePkmn") {
      card = removeActivePkmn();
    } else if (location === "energyBench") {
      card = removeEnergyBench(index, energyIndex);
    } else if (location === "energyActive") {
      card = removeEnergyActive(energyIndex);
    }
    setHand([...card, ...deck]);
  };

  const pickCardFromDeck = () => {
    // look at the cards inside the deck and pick cards
    // Opens up a modal that shows the cards in the deck
    // each card can be clicked to return to hand
  };

  const retrieveCardFromDiscard = () => {
    // look at cards in discard and put cards to hand
    // Opens up a modal that shows the cards in the discard
    // each card can be clicked to return to hand
  };

  const putDeckCardsInOrder = () => {
    // allow players to reorder the deck
  };
  // ===================================================================

  const shuffle = () => {
    let shuffledDeck = localDeck.cards;
    if (shuffledDeck.length > 0) {
      for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor(Math.random() * shuffledDeck.length);
        let location2 = Math.floor(Math.random() * shuffledDeck.length);
        let temp = shuffledDeck[location1];
        shuffledDeck[location1] = shuffledDeck[location2];
        shuffledDeck[location2] = temp;
      }
    }
    setLocalDeck((prevState) => {
      return {
        ...prevState,
        cards: shuffledDeck,
      };
    });
  };

  // draws the top card from the deck
  const draw = () => {
    let drawnDeck = localDeck.cards;
    if (drawnDeck.length > 0) {
      let drawnCard = drawnDeck.shift();
      setLocalDeck((prevState) => {
        return {
          ...prevState,
          cards: drawnDeck,
        };
      });
      setHand([...hand, drawnCard]);
    }
  };

  const restart = () => {
    setHand([]);
    setZValue(1);
    getDeck(localDeck.id);
  };

  // Brings the card front on click
  // get the element by its id and then increase its z-index by 1
  const bringFront = (cardId) => {
    let elem = document.getElementById(cardId);
    setZValue(zValue + 1);
    elem.style.zIndex = zValue;
  };

  // const playActivePkmn = (card) => {
  //   setActivePkmn(card)
  //   socket.emit("activePkmn", card)
  // }

  const playEnergy = (card) => {};
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
    return <Redirect to="/" />;
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
                setIndexSelected(index);
                selectCard(card, "hand", index);
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
            <div style={{ position: "relative", margin: 10 }}>
              <img
                key={index}
                width="60px"
                src={card.pkmn.imageUrl}
                alt=""
                onClick={() => {
                  setIndexSelected(index);
                  selectCard(card.pkmn, "benchPkmn", index);
                }}
              />
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
      <div className="bench2-placeholder">Bench</div>
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
                  width="100%"
                  src={energy.imageUrl}
                  onClick={() =>
                    selectCard(energy, "energyActive", 0, energyIndex)
                  }
                />
              ))}
            <img
              width="100%"
              style={{ zIndex: 50 }}
              src={activePkmn.pkmn && activePkmn.pkmn.imageUrl}
              alt=""
              onClick={() => selectCard(activePkmn.pkmn, "activePkmn", 0)}
            />
          </div>
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
            onClick={() =>
              selectCard(discardedPkmn[0], "discardedPkmn", "discardPile")
            }
          />
        )}
      </div>
      <>
        <div className="side-panel">
          <SidePanel
            card={selectedCard}
            index={indexSelected}
            setActive={addActivePkmn}
            setBench={addBenchPkmn}
            setDiscard={discard}
            setSwitch={switchPkmn}
            setEnergy={attachEnergy}
            isActive={activePkmn.pkmn}
            returnToHand={removeAndAddToHand}
            // hoverImage={hoverImage}
          />
        </div>
        <div className="btn-group">
          <button onClick={restart}>Restart</button>
          <button onClick={createGame}>Create Game</button>
          <button onClick={shuffle}>Shuffle</button>
          <button onClick={draw}>Draw</button>
        </div>
      </>
      <img
        id="card-back-img"
        draggable="false"
        src={pokeCardBack}
        alt="pokecard"
        width="100px"
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
  );
};

Play.propTypes = {
  getDeck: PropTypes.func.isRequired,
  getAllDecks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
  deckLoading: state.deck.deckLoading,
  isAuthenticated: state.auth.isAuthenticated,
  decks: state.deck.decks,
  decksLoading: state.deck.decksLoading,
});

export default connect(mapStateToProps, { getDeck, getAllDecks })(Play);
