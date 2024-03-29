import React, { useState } from "react"

const Coin = React.memo(() => {
  const [result, setresult] = useState({ coin: "", tossed: false })

  const coinToss = () => {
    if (Math.random() < 0.5) {
      setresult({ coin: "heads", tossed: false })
    } else {
      setresult({ coin: "tails", tossed: false })
    }
  }

  return (
    <div className="App">
      <div id="coin" className={result.coin} key={+new Date()}>
        <div class={result.tossed && "side-a"} onClick={coinToss}>
          <img
            src="https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/products/pictures/1110551.jpg"
            alt=""
            width="100px"
          />
        </div>
        <div className="side-b" onClick={coinToss}>
          <img
            src="https://cdn.bulbagarden.net/upload/thumb/e/e5/Back_of_Dutch_Pok%C3%A9mon_Coin.png/200px-Back_of_Dutch_Pok%C3%A9mon_Coin.png"
            alt=""
            width="100px"
          />
        </div>
      </div>
    </div>
  )
})

export default Coin
