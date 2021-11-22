"use strict";
import assets from "./assets.js";

//Game state when initialize
const game = {
  score: 0,
};

//player state when initialize
const player = {
  has_bag: false,
  is_capture: false,
  position: 0,
  life: 3,
};

const octopus = {};

const showAsset = (asset) => {
  asset.style.visibility = "visible";
};

const hideAsset = (asset) => {
  asset.style.visibility = "hidden";
};

const moveRight = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (player.position < 5) {
    player.position++;
  }
  if (player.position > 0 && player.position <= 5) {
    //for position 0 the naming of the id is different from the other position (is p_life0)
    //prettier-ignore
    lastPosId = (player.position-1) === 0 ? "p_life0" : `p_pos${player.position - 1}`;
    hideAsset(assets.player[lastPosId]);
  }
  //for position 5 the id naming include a _grp behind
  //prettier-ignore
  moveToPosId = player.position === 5 ? `p_pos${player.position}_grp` : `p_pos${player.position}`;
  showAsset(assets.player[moveToPosId]);
};

const moveLeft = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (player.position > 0) {
    player.position--;
  }
  if (player.position >= 0 && player.position < 5) {
    //for position 5 the id naming include a _grp behind
    //prettier-ignore
    lastPosId = player.position + 1 === 5 ? `p_pos${player.position+1}_grp` : `p_pos${player.position + 1}`;
    hideAsset(assets.player[lastPosId]);
  }
  //for position 0 the naming of the id is different from the other position (is p_life0)
  //prettier-ignore
  moveToPosId = player.position === 0 ? "p_life0" : `p_pos${player.position}`;
  showAsset(assets.player[moveToPosId]);
};

window.addEventListener(
  "keydown",
  function (e) {
    let keyType = "";
    switch (e.key) {
      case "ArrowRight":
        // setTimeout(moveRight, 200);
        moveRight();
        console.log(player.position);
        break;
      case "ArrowLeft":
        moveLeft();
        console.log(player.position);
        break;
      default:
        break;
    }
  },
  true
);
