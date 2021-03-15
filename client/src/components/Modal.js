import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Slider from "react-slick";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    width: 500,
    padding: 25,
    // textAlign: "center",
  },
}));

export default function TransitionsModal({
  cards,
  clicked,
  close,
  addToHand,
  location,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  console.log(location);

  useEffect(() => {
    setOpen(clicked);
  }, [clicked]);

  const handleClose = () => {
    setOpen(false);
    close(false);
    setSelectedCards([]);
  };

  //   const slidesNo = cards

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  const undo = () => {
    let copySelected = selectedCards;
    copySelected.pop();
    setSelectedCards(copySelected);
  };

  const add = () => {
    addToHand(selectedCards);
    setSelectedCards([]);
    setOpen(false);
    close(false);
  };

  const reset = () => {
    setSelectedCards([]);
  };

  //   const update = (index) => {
  //     let copy = copyCards;
  //     copy.splice(index, 1);
  //     setCopyCards(copy);
  //   };

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
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography>
              {location === "deck" ? "Deck" : "Discard Pile"}
            </Typography>
            <Typography>
              Selected Cards:{" "}
              {selectedCards.map((card, index) => (
                <>{card.card.name}, </>
              ))}
            </Typography>
            <Slider {...settings}>
              {cards.map((card, index) => (
                <img
                  key={index}
                  width="100px"
                  src={card.imageUrl}
                  alt=""
                  onClick={() => {
                    setSelectedCards([
                      ...selectedCards,
                      { card: card, index: index },
                    ]);
                  }}
                />
              ))}
            </Slider>
            <Button variant="contained" color="primary" onClick={add}>
              Add to Hand
            </Button>
            {/* <Button onClick={() => undo()}>Undo</Button> */}
            <Button variant="contained" onClick={() => reset()}>
              Reset
            </Button>
          </Card>
        </Fade>
      </Modal>
    </div>
  );
}
