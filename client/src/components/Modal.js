import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Slider from "react-slick"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import CloseIcon from "@material-ui/icons/Close"
import { CardHeader, IconButton } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    width: 800,
    padding: 25,
    textAlign: "center",
  },
  slider: {
    margin: 20,
  },
  header: {
    display: "flex",
  },
}))

export default function TransitionsModal({
  cards,
  clicked,
  close,
  addToHand,
  location,
}) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState("")

  useEffect(() => {
    setOpen(clicked)
  }, [clicked])

  const handleClose = () => {
    setOpen(false)
    close(false)
    setSelectedCard("")
  }

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  }

  const add = () => {
    if (selectedCard.card) {
      addToHand(selectedCard)
      setSelectedCard("")
      setOpen(false)
      close(false)
    }
  }

  const reset = () => {
    setSelectedCard("")
  }

  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Card className={classes.root}>
            <div className={classes.header}>
              <div style={{ width: "48px" }}></div>
              <div style={{ flexDirection: "column", flexGrow: 1 }}>
                <Typography gutterBottom variant="h4">
                  {location === "deck" ? "Deck" : "Discard Pile"}
                </Typography>
                {location === "deck" && (
                  <Typography>
                    Remaining cards:{" "}
                    <span style={{ fontWeight: "bold" }}>{cards.length}</span>
                  </Typography>
                )}
              </div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <Slider {...settings} className={classes.slider}>
              {cards.map((card, index) => (
                <img
                  key={index}
                  width="100px"
                  src={card.imageUrl}
                  alt=""
                  onClick={() => {
                    setSelectedCard({ card: card, index: index })
                  }}
                />
              ))}
            </Slider>
            <Typography gutterBottom>
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {selectedCard.card?.name}
              </span>
            </Typography>
            <Button variant="contained" color="primary" onClick={add}>
              Add to Hand
            </Button>
            {/* <Button onClick={() => undo()}>Undo</Button> */}
            {/* <Button variant="contained" onClick={() => reset()}>
              Reset
            </Button> */}
          </Card>
        </Fade>
      </Modal>
    </div>
  )
}
