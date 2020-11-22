import React, { useState, useEffect } from "react";

export default function Search() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://api.pokemontcg.io/v1/cards?name=${name}`
    );
    const data = await response.json();
    setCards(data);
    setLoading(false);
  };

  function handleChange(e) {
    setName(e.target.value);
  }

  //   useEffect(() => {
  //     // let container = $("#display-container");

  //     // if (cards.length > 0) {
  //     //   container.html(cards.cards[0].name);
  //     // }
  //     let container = document.getElementById("display-container");
  //     let html = cards.map(card => {
  //         <div>

  //         </div>
  //     });
  //   }, []);

  // if the state changed render that particular component

  return (
    <div>
      <form className="form-inline my-2 my-lg-0">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search for Pokemon"
          aria-label="Search"
          onChange={handleChange}
          value={name}
        />
        <button
          onClick={handleSubmit}
          className="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Search
        </button>
      </form>

      <div id="display-container">
        {/* {cards.length > 0 && (
          <ul className="results">
            {cards.map((card) => (
              <li key={card.id}>Hi</li>
            ))}
          </ul>
        )} */}
        {/* {loading ? <div>Loading</div> : <img src={cards.cards[0].imageUrl} />} */}
        {loading ? (
          <div>Loading</div>
        ) : (
          <ul className="results">{console.log(cards)}</ul>
        )}
      </div>
    </div>
  );
}
