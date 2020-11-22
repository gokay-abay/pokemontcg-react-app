import React, { Component } from "react";
import { options } from "./inputOptions";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      name: "",
      setCode: "",
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        console.log(json);
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

  render() {
    return (
      <div className="container">
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
              {this.state.cards.map((card) => (
                <li className="poke-card" key={card.id}>
                  <img src={card.imageUrl} alt={card.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
