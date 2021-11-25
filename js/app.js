"use strict";
import assets from "./assets.js";
import scoreDisplay from "./score_display.js";
import { randomInteger, showAsset, hideAsset } from "./utils.js";
//////////////////////////////////////////////////////////////
// All game state start here
/////////////////////////////////////////////////////////////
//Game state when initialize
const game = {
  score: 0,
  pause: false,
  speed: 1,
  gameOver: false,
};
//player state when initialize
const player = {
  has_bag: false,
  is_capture: false,
  position: 0,
  life: 3,
  cashInProgress: false,
};
//octopus state when initialize
const octopus = {
  legAvailable: ["leg1", "leg2", "leg3", "leg4", "leg5"],
  activeLegs: [],
};
//----------------------------------------------------------------
//////////////////////////////////////////////////////////////
// globale Variable declaration
/////////////////////////////////////////////////////////////
// for reference gsap master timeline
// const masterTl = gsap.timeline({ autoRemoveChildren: true });
//----------------------------------------------------------------
// time line declaration
//----------------------------------------------------------------
let timelineStore = [];
let capturedAimationController = null;
// const capturedTl = gsap.timeline({ paused: true });
const startGameBtn = document.getElementById("start-game");
const pauseGameBtn = document.getElementById("pause-game");
const gameOverDialog = document.getElementById("modalGameOver");
const gameOverModal = new bootstrap.Modal(gameOverDialog);
// const beepSound = document.getElementById("beep");
// const tickSound = document.getElementById("tick");

//////////////////////////////////////////////////////////////
// player action
/////////////////////////////////////////////////////////////
const moveRight = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (game.pause === false) {
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
  }
};

const moveLeft = () => {
  let moveToPosId = "";
  let lastPosId = "";
  if (game.pause === false) {
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
  }
};
const incrementScore = () => {
  if (game.score <= 1000) {
    game.score++;
    scoreDisplay.display(game.score);
    switch (game.score) {
      case 30:
        game.speed = 0.8;
        break;
      case 60:
        game.speed = 0.6;
        break;
      case 100:
        game.speed = 0.5;
        break;
    }
  } else {
    gameWin();
  }
};

const grabCoin = () => {
  incrementScore();
  beepSound.play();
  if (player.has_bag === false) {
    showAsset(assets.player.p_pos5_bag);
    player.has_bag = true;
  }
  let tl = gsap.timeline({
    onComplete: function () {
      if (player.position !== 5) {
        hideAsset(assets.player.p_pos5_hand2);
      }
    },
  });
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

const cashIn = () => {
  player.has_bag = false;
  player.cashInProgress = true;
  let tl = gsap.timeline({
    repeat: 1,
    repeatDelay: 0.1,
    onComplete: function () {
      console.log("my pos", player.position);
      if (player.position !== 0) {
        hideAsset(assets.player.p_pos0_bag);
        hideAsset(assets.player.p_pos0_hand);
      }
      player.cashInProgress = false;
    },
  });
  tl.set(assets.player.p_pos0_hand, { visibility: "hidden", delay: 0.1 });
  tl.set(assets.player.p_pos0_bag, { visibility: "visible", delay: 0.1 });
  tl.set(assets.player.p_pos0_bag, { visibility: "hidden", delay: 0.1 });
  tl.set(assets.player.p_pos0_hand, {
    visibility: "visible",
    delay: 0.1,
    onComplete: function () {
      incrementScore();
    },
  });
};
//////////////////////////////////////////////////////////////
// octopus action
/////////////////////////////////////////////////////////////
const retractOctopusLeg = (targetLeg, delay = 0) => {
  const keys = Object.keys(assets.octopus[targetLeg]);
  let tl = gsap.timeline({
    delay,
    onComplete: () => {
      let legLocation = 0;
      let startDelay = 0;
      let randomInt = 0;
      let newTargetLeg = "";
      let index = octopus.activeLegs.indexOf(targetLeg);
      if (index !== -1) {
        octopus.activeLegs.splice(index, 1);
      }
      newTargetLeg = targetLeg;
      if (targetLeg === "leg1" || targetLeg === "leg2") {
        randomInt = randomInteger(1, 2);
        newTargetLeg = `leg${randomInt}`;
      }
      legLocation = Number(newTargetLeg.charAt(newTargetLeg.length - 1));
      startDelay = Math.ceil(randomInteger(0, 4) * game.speed * 1000);

      if (!game.gameOver) {
        setTimeout(() => {
          timelineStore[legLocation - 1].restart();
          octopus.activeLegs.push(newTargetLeg);
          if (game.pause) {
            timelineStore[legLocation - 1].pause();
          }
          console.log("retract completed");
        }, startDelay);
      }
    },
  });
  for (const key of keys.reverse()) {
    tl.set(assets.octopus[targetLeg][key], {
      visibility: "hidden",
      delay: game.speed,
    });
  }
  return tl;
};

const extendOctopusLeg = (targetLeg, delay = 0) => {
  const keys = Object.keys(assets.octopus[targetLeg]);
  let tl = gsap.timeline({
    delay,
    onComplete: () => {
      let legLocation = Number(targetLeg.charAt(targetLeg.length - 1));
      setTimeout(() => {
        console.log("extend completed:", targetLeg);
        if (player.position === legLocation) {
          game.pause = true;
          console.log("game pause");
          pauseGame(true);
          console.log("Captured");

          for (let i = 1; i <= 5; i++) {
            let PosId = `p_pos${i}`;
            hideAsset(assets.player[PosId]);
            if (i === 5) hideAsset(assets.player.p_pos5_hand2);
            if (player.has_bag) hideAsset(assets.player[PosId + "_bag"]);
          }
          runCaptured(player.position);
          if (!game.gameOver) {
            setTimeout(() => {
              game.pause = false;
              console.log("game resume");
              pauseGame(false);
              player.position = 0;
              player.has_bag = false;
            }, 3700);
          } else {
            gameStop();
          }
        }
      }, 350);
    },
  });

  for (const key of keys) {
    tl.set(assets.octopus[targetLeg][key], {
      visibility: "visible",
      delay: game.speed,
    });
  }
  return tl;
};

const randomPickOctopusLeg = () => {
  const noOfAvailableLegs = octopus.legAvailable.length;
  let randomIndex = 0;
  if (noOfAvailableLegs === 1) {
    return octopus.legAvailable.pop();
  } else {
    randomIndex = randomInteger(0, octopus.legAvailable.length - 1);
    return octopus.legAvailable.splice(randomIndex, 1)[0];
  }
};

const moveLife = () => {
  setTimeout(() => {
    if (player.life === 2) {
      hideAsset(assets.player.p_life1);
      showAsset(assets.player.p_pos0);
      showAsset(assets.player.p_pos0_hand);
      setTimeout(() => {
        hideAsset(assets.player.p_life2);
        showAsset(assets.player.p_life1);
      }, 1500);
    } else {
      hideAsset(assets.player.p_life1);
      showAsset(assets.player.p_pos0);
      showAsset(assets.player.p_pos0_hand);
    }
  }, 1500);
};

const capturedAimation = () => {
  showAsset(assets.player.p_lost);
  showAsset(assets.octopus.leg4.o_pos4_0);
  showAsset(assets.octopus.leg4.o_pos4_1);
  showAsset(assets.octopus.leg3.o_pos3_0);
  showAsset(assets.octopus.leg3.o_pos3_1);
  let tl = gsap.timeline({
    onComplete: function () {
      if (player.life !== 0) {
        setTimeout(() => {
          hideAsset(assets.player.p_lost);
          hideAsset(assets.octopus.leg4.o_pos4_0);
          hideAsset(assets.octopus.leg4.o_pos4_1);
          hideAsset(assets.octopus.leg3.o_pos3_0);
          hideAsset(assets.octopus.leg3.o_pos3_1);
          hideAsset(assets.player.p_lost_anim_set2);
        }, 300);
      } else {
        capturedAimationController.clear();
        capturedAimationController = capturedAimation();
      }
    },
  });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "visible", delay: 0.2 });
  tl.set(assets.player.p_lost_anim_set1, { visibility: "hidden", delay: 0.3 });
  tl.set(assets.player.p_lost_anim_set2, { visibility: "visible", delay: 0.2 });
  return tl;
};

const runCaptured = (playerPosition) => {
  // deduct player life state
  player.life--;
  // find out player current position and hide it
  // if current position is at 5 then need hide extra hand
  let currentPosId = `p_pos${playerPosition}`;
  hideAsset(assets.player[currentPosId]);
  if (player.position === 5) hideAsset(assets.player.p_pos5_hand2);
  if (player.has_bag) hideAsset(assets.player[currentPosId + "_bag"]);
  // restart leg4 animation and pause it so that the leg segments are
  // hidden. this is to prepare for capture animation on leg4
  // using the timeline to control instead of hiding the individual segment
  // less code
  timelineStore[2].restart();
  timelineStore[2].pause();
  timelineStore[3].restart();
  timelineStore[3].pause();
  //run the capturedAnimation and assign it to global variable
  //so that can control/pause the animation outside the function later
  capturedAimationController = capturedAimation();
  // set state to game over when life is zero and exit function
  // if yet to game over, continue with the shifting player on the boat
  // funtion
  if (player.life === 0) {
    game.gameOver = true;
    return;
  } else {
    moveLife();
  }
};

const buildTimeLine = () => {
  for (let i = 0; i <= octopus.legAvailable.length - 1; i++) {
    timelineStore[i].add(extendOctopusLeg(octopus.legAvailable[i]));
    timelineStore[i].add(retractOctopusLeg(octopus.legAvailable[i]));
  }
};

//////////////////////////////////////////////////////////////
// overall game control section
/////////////////////////////////////////////////////////////

const pauseGame = (toPause) => {
  let activeLeg = "";
  let index = 0;
  for (let i = 0; i <= octopus.activeLegs.length - 1; i++) {
    activeLeg = octopus.activeLegs[i];
    index = Number(activeLeg.charAt(activeLeg.length - 1)) - 1;
    if (toPause) {
      if (!timelineStore[index].paused()) {
        timelineStore[index].pause();
      }
    } else {
      if (timelineStore[index].paused()) {
        timelineStore[index].resume();
      }
    }
  }
};

const gameStop = () => {
  timelineStore = [];
  pauseGameBtn.classList.add("disabled");
  document.querySelector("h5.modal-title").innerText = "Game Over";
  document.querySelector(".modal-body").innerText =
    "Thanks for playing! Hope you like it!!!";
  setTimeout(() => {
    gameOverModal.show();
  }, 2500);
};

const gameWin = () => {
  pauseGameBtn.classList.add("disabled");
  document.querySelector("h5.modal-title").innerText = "Game Win!";
  document.querySelector(".modal-body").innerText =
    "Well done! Thanks for playing. Hope you like it!!!";
  gameOverModal.show();
};

const gameInit = () => {
  game.score = 0;
  scoreDisplay.init();
  game.pause = false;
  game.speed = 1;
  game.gameOver = false;
  player.has_bag = false;
  player.is_capture = false;
  player.position = 0;
  player.life = 3;
  player.cashInProgress = false;
  octopus.legAvailable = ["leg1", "leg2", "leg3", "leg4", "leg5"];
  pauseGameBtn.innerText = "Pause Game";
  if (timelineStore.length > 0) {
    for (let i = 0; i <= timelineStore.length - 1; i++) {
      timelineStore[i].clear();
    }
  }
  timelineStore = [];
  for (let i = 0; i <= 4; i++) {
    timelineStore[i] = gsap.timeline({ paused: true });
  }
  if (capturedAimationController !== null) {
    capturedAimationController.clear();
  }
  capturedAimationController = null;

  for (let i = 1; i <= 5; i++) {
    let posId = `p_pos${i}`;
    hideAsset(assets.player[posId]);
    hideAsset(assets.player[posId + "_bag"]);
    if (i === 5) hideAsset(assets.player.p_pos5_hand2);
  }

  showAsset(assets.player.p_pos0);
  showAsset(assets.player.p_pos0_hand);
  showAsset(assets.player.p_life1);
  showAsset(assets.player.p_life2);
  hideAsset(assets.player.p_lost);
  octopus.legAvailable.map((leg) => {
    // let legObj = Object.entries(assets.octopus[leg]);
    let legObj = Object.keys(assets.octopus[leg]);
    for (const segment of legObj) {
      hideAsset(assets.octopus[leg][segment]);
    }
  });

  hideAsset(assets.octopus.leg4.o_pos4_0);
  hideAsset(assets.octopus.leg4.o_pos4_1);
  hideAsset(assets.octopus.leg3.o_pos3_0);
  hideAsset(assets.octopus.leg3.o_pos3_1);
  hideAsset(assets.player.p_lost);
  hideAsset(assets.player.p_lost_anim_set1);
  hideAsset(assets.player.p_lost_anim_set2);
  buildTimeLine();
};

const startGame = () => {
  gameInit();
  pauseGameBtn.classList.remove("disabled");
  octopus.legAvailable.shift();
  let legPicked = "";
  let timelineStoreIndex = 0;
  const noOfAvailableLegs = octopus.legAvailable.length;
  for (let i = 0; i <= noOfAvailableLegs - 1; i++) {
    legPicked = randomPickOctopusLeg();
    timelineStoreIndex = Number(legPicked.charAt(legPicked.length - 1)) - 1;
    timelineStore[timelineStoreIndex].resume().delay(i * game.speed);
    octopus.activeLegs.push(legPicked);
  }
};

//////////////////////////////////////////////////////////////
// event listener
/////////////////////////////////////////////////////////////
window.addEventListener(
  "keydown",
  function (e) {
    if (game.pause === false) {
      switch (e.key) {
        case "ArrowRight":
          if (player.position === 5) {
            grabCoin();
          } else {
            if (player.position === 0 && player.cashInProgress) {
              setTimeout(() => {
                moveRight();
              }, 500);
            } else {
              moveRight();
            }
          }
          console.log("i am at pos:", player.position);
          break;
        case "ArrowLeft":
          if (player.position === 5) {
            setTimeout(() => {
              moveLeft();
            }, 300);
          } else {
            moveLeft();
          }
          if (player.position === 0 && player.has_bag) {
            cashIn();
          }
          console.log("i am at pos:", player.position, `game:${game.pause}`);
          break;
        default:
          break;
      }
    }
  },
  true
);

startGameBtn.addEventListener("click", function () {
  startGame();
});

pauseGameBtn.addEventListener("click", function () {
  console.log("hi");
  if (pauseGameBtn.innerText === "Pause Game") {
    game.pause = true;
    pauseGame(true);
    pauseGameBtn.innerText = "Resume Game";
  } else if (pauseGameBtn.innerText === "Resume Game") {
    game.pause = false;
    pauseGame(false);
    pauseGameBtn.innerText = "Pause Game";
  }
});

gameOverDialog.addEventListener("hidden.bs.modal", function (evt) {
  gameInit();
});

// tickSound.playbackRate = ;
// tickSound.play();

// setTimeout(() => {
//   tickSound.pause();
// }, 5000);
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
