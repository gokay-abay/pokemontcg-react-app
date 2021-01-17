import React, { Component } from "react";
import { options } from "./inputOptions";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: [],
      playDeck: [],
      hand: [],
      discard: [],
      cards: [],
      qty: 1,
      name: "pikachu",
      setCode: "base1",
      isLoaded: false,
      cardClicked: false,
      deckDisplayed: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayBtn = this.displayBtn.bind(this);
  }

  fetchData = () => {
    fetch(
      `https://api.pokemontcg.io/v1/cards?setCode=${this.state.setCode}&name=${this.state.name}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          cards: json.cards,
          isLoaded: true,
        });
      });
  };

  handleSearchChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleOptionChange = (e) => {
    this.setState({
      setCode: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchData();
  };

  displayBtn = () => {
    // display add card button
    this.setState({
      cardClicked: !this.state.cardClicked,
    });
  };

  addCard = (card, qty) => {
    // add the clicked card to the deck array

    let refDeck = this.state.deck;

    if (qty > 0 && qty < 5) {
      for (var i = 0; i < qty; i++) {
        refDeck.push(card);
      }

      this.setState({
        deck: [...refDeck],
      });
    }

    this.setState({
      qty: 1,
    });
  };

  handleQtyChange = (e) => {
    this.setState({
      qty: e.target.value,
    });
  };

  displayDeck = () => {
    this.setState({
      deckDisplayed: true,
    });
  };

  shuffle = () => {
    var shuffledDeck = this.state.playDeck;

    if (shuffledDeck.length > 0) {
      for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor(Math.random() * shuffledDeck.length);
        var location2 = Math.floor(Math.random() * shuffledDeck.length);

        var temp = shuffledDeck[location1];

        shuffledDeck[location1] = shuffledDeck[location2];
        shuffledDeck[location2] = temp;
      }
    }

    this.setState({
      playDeck: shuffledDeck,
    });
  };

  draw = () => {
    // draws the top card from the deck
    var drawnDeck = this.state.playDeck;

    if (drawnDeck.length > 0) {
      var drawnCard = drawnDeck.shift();

      this.setState({
        playDeck: drawnDeck,
      });

      this.setState({
        hand: [...this.state.hand, drawnCard],
      });
    } else {
      return <h1>Your Deck is empty!</h1>;
    }
  };

  play = () => {
    // shows a back of a pokemon card
    // has a draw button that removes the card from the deck and stores it in a hand array
    let refDeck = this.state.deck;

    this.setState({
      deckDisplayed: false,
    });

    this.setState({
      hand: [],
    });

    this.setState({
      playDeck: [...refDeck],
    });
  };

  discard = () => {
    // removes the selected card from the hand array and stores it in a discard array
  };

  playActivePokemon = () => {
    // places the selected pokemon in the middle of the board. removes the card from the hand array and stores it in activePokemon variable/state
  };

  playBenchPokemon = () => {
    // places the selected card to the bench. removes the card from the hand array and stores it in bench array
  };

  render() {
    return (
      <div className="container">
        <button className="btn btn-primary m-2" onClick={this.play}>
          Play
        </button>
        <button className="btn btn-primary m-2" onClick={this.displayDeck}>
          My Deck
        </button>

        {!this.state.deckDisplayed ? (
          <div>
            <img
              src="https://images.pokemontcg.io/swsh35/card.png"
              alt=""
              width="200px"
            />
            <button className="btn btn-success m-2" onClick={this.shuffle}>
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
            </ul>
          </div>
        ) : (
          <div>
            <div className="select-container">
              <select
                className="form-control select-item"
                value={this.state.setCode}
                onChange={this.handleOptionChange.bind(this)}
              >
                {options.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <form className="form-inline my-lg-0 form-container">
              <input
                className="form-control mr-sm-2 col-9"
                type="search"
                placeholder="Search for Pokemon"
                aria-label="Search"
                onChange={this.handleSearchChange}
                value={this.state.name}
              />
              <button
                onClick={this.handleSubmit}
                className="btn btn-outline-success my-2 my-sm-0 col"
                type="submit"
              >
                Search
              </button>
            </form>
            <div id="display-container">
              {!this.state.isLoaded ? (
                ""
              ) : (
                <ul className="list">
                  {this.state.cards.map((card, index) => (
                    <li
                      className="poke-card"
                      key={index}
                      onClick={this.displayBtn}
                    >
                      <img src={card.imageUrl} alt={card.name} />
                      <div>
                        <label for="qty">Quantity:</label>
                        <input
                          type="number"
                          name="qty"
                          id="qty"
                          onChange={this.handleQtyChange}
                          value={this.state.qty}
                          min="1"
                          max={card.supertype === "Energy" ? "60" : "4"}
                        />
                        <button
                          className="btn-primary"
                          onClick={() => {
                            this.addCard(card, this.state.qty);
                          }}
                        >
                          Add Card
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="display-container">
              <ul className="list">
                {this.state.deck.map((card, index) => (
                  <li className="poke-card" key={index}>
                    <img src={card.imageUrl} alt={card.name} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}
