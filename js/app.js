"use strict";
import assets from "./assets.js";

//////////////////////////////////////////////////////////////
// All game state start here
/////////////////////////////////////////////////////////////
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
//octopus state when initialize
const octopus = {};

const showAsset = (asset) => {
  gsap.set(asset, { visibility: "visible", delay: 0.1 });
};

const hideAsset = (asset) => {
  gsap.set(asset, { visibility: "hidden", delay: 0.1 });
};

const moveRight = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (player.position < 5) {
    player.position++;
  }
  if (player.position > 0 && player.position <= 5) {
    //for position 0 the hand (p_pos0_hand) must hide
    if (player.position - 1 === 0) {
      hideAsset(assets.player.p_pos0_hand);
    }
    lastPosId = `p_pos${player.position - 1}`;
    hideAsset(assets.player[lastPosId]);
    if (player.has_bag) {
      hideAsset(assets.player[lastPosId + "_bag"]);
    }
  }
  //for position 5 the hand (p_pos5_hand2) must show
  if (player.position === 5) {
    showAsset(assets.player.p_pos5_hand2);
  }
  moveToPosId = `p_pos${player.position}`;
  showAsset(assets.player[moveToPosId]);
  if (player.has_bag) {
    showAsset(assets.player[moveToPosId + "_bag"]);
  }
};

const moveLeft = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (player.position > 0) {
    player.position--;
  }
  if (player.position >= 0 && player.position < 5) {
    //for position 5 the hand (p_pos5_hand2) must hide
    if (player.position + 1 === 5) {
      hideAsset(assets.player.p_pos5_hand2);
    }
    lastPosId = `p_pos${player.position + 1}`;
    hideAsset(assets.player[lastPosId]);
    if (player.has_bag) {
      hideAsset(assets.player[lastPosId + "_bag"]);
    }
  }
  //for position 0 the naming of the id is different from the other position (is p_life0)
  if (player.position === 0) {
    showAsset(assets.player.p_pos0_hand);
  }
  moveToPosId = `p_pos${player.position}`;
  showAsset(assets.player[moveToPosId]);
  if (player.has_bag) {
    showAsset(assets.player[moveToPosId + "_bag"]);
  }
};

const grabCoin = () => {
  game.score++;
  if (player.has_bag === false) {
    showAsset(assets.player.p_pos5_bag);
    player.has_bag = true;
  }
  let tl = gsap.timeline();
  tl.set("#p-pos5-hand2", { visibility: "hidden", delay: 0.1 }).set(
    "#p-pos5-hand1",
    {
      visibility: "visible",
    }
  );
  tl.set("#p-pos5-hand1", { visibility: "hidden", delay: 0.1 }).set(
    "#p-pos5-hand2",
    {
      visibility: "visible",
    }
  );
  tl.set("#p-pos5-hand2", { visibility: "hidden", delay: 0.1 }).set(
    "#p-pos5-hand3",
    {
      visibility: "visible",
    }
  );
  tl.set("#p-pos5-hand3", { visibility: "hidden", delay: 0.1 }).set(
    "#p-pos5-hand2",
    {
      visibility: "visible",
    }
  );
};

window.addEventListener(
  "keydown",
  function (e) {
    switch (e.key) {
      case "ArrowRight":
        if (player.position === 5) {
          grabCoin();
        } else {
          moveRight();
        }
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

// function listener(event) {
//   var l = document.createElement("li");
//   switch (event.type) {
//     case "animationstart":
//       console.log(`Started: elapsed time is ${event.elapsedTime}`);
//       break;
//     case "animationend":
//       console.log(`Ended: elapsed time is ${event.elapsedTime}`);
//       break;
//   }
// }

// const grabCoin = () => {
//   assets.player.p_pos5_hand2.style.visibility = "hidden";
//   assets.player.p_pos5_hand1.addEventListener(
//     "animationend",
//     function () {
//       assets.player.p_pos5_hand1.classList.remove("test");
//       assets.player.p_pos5_hand1.removeEventListener("animationend", listener);
//     },
//     false
//   );

//   assets.player.p_pos5_hand1.classList.add("test");
// };
