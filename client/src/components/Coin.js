import React, { useState } from "react"

const Coin = () => {
  const [result, setresult] = useState({ coin: "", tossed: false })
  //   const [tossed, setTossed] = useState(false)

  const coinToss = () => {
    setresult({ coin: "", tossed: true })
    if (Math.random() < 0.5) {
      setresult({ coin: "heads", tossed: false })
      console.log("heads")
    } else {
      setresult({ coin: "tails", tossed: false })
      console.log("tails")
    }
  }
  return (
    <div className="App">
      <div id="coin" className={result.coin} key={+new Date()}>
        <div class="side-a" onClick={coinToss}>
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
}

export default Coin
