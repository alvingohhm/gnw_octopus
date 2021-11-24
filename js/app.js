"use strict";
import assets from "./assets.js";
import { randomInteger, showAsset, hideAsset } from "./utils.js";
//////////////////////////////////////////////////////////////
// All game state start here
/////////////////////////////////////////////////////////////
//Game state when initialize
const game = {
  score: 0,
  pause: false,
  speed: 0.7,
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
const timelineStore = [];
for (let i = 0; i <= 4; i++) {
  timelineStore[i] = gsap.timeline({ paused: true });
}

//////////////////////////////////////////////////////////////
// player action
/////////////////////////////////////////////////////////////
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
      game.score++;
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
      setTimeout(() => {
        timelineStore[legLocation - 1].restart();
        octopus.activeLegs.push(newTargetLeg);
        if (game.pause) {
          timelineStore[legLocation - 1].pause();
        }
        console.log("retract completed");
      }, startDelay);
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
          pauseGame(true);
          console.log("Captured");
          runCaptured();
          if (player.life !== 0) {
            setTimeout(() => {
              game.pause = false;
              pauseGame(false);
              player.position = 0;
              player.has_bag = false;
            }, 3600);
          } else {
            gameStop();
          }
        }
      }, 200);
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

const buildTimeLine = () => {
  for (let i = 0; i <= octopus.legAvailable.length - 1; i++) {
    timelineStore[i].add(extendOctopusLeg(octopus.legAvailable[i]));
    timelineStore[i].add(retractOctopusLeg(octopus.legAvailable[i]));
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
        capturedAimation();
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
};

const runCaptured = () => {
  player.life--;
  let posId = `p_pos${player.position}`;

  // find out player current position and hide it
  hideAsset(assets.player[posId]);
  if (player.position === 5) {
    hideAsset(assets.player.p_pos5_hand2);
  }
  if (player.has_bag) {
    hideAsset(assets.player[posId + "_bag"]);
  }

  // restart leg4 animation and pause it so that the leg segments are
  // hidden. this is to prepare for capture animation on leg4
  timelineStore[2].restart();
  timelineStore[2].pause();
  timelineStore[3].restart();
  timelineStore[3].pause();

  capturedAimation();
  // game over when life is zero
  if (player.life === 0) {
    console.log("game over");
    return;
  } else {
    moveLife();
  }
};

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

const gameStop = () => {};

const gameInit = () => {
  game.score = 0;
  game.pause = false;
  game.speed = 1;
  player.has_bag = false;
  player.is_capture = false;
  player.position = 0;
  player.life = 3;
  player.cashInProgress = false;
  octopus.legAvailable = ["leg1", "leg2", "leg3", "leg4", "leg5"];
};

const startGame = () => {
  gameInit();
  buildTimeLine();
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

// startGame();

//////////////////////////////////////////////////////////////
// event listener
/////////////////////////////////////////////////////////////
window.addEventListener(
  "keydown",
  function (e) {
    if (!game.pause) {
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
          console.log("i am at: ", player.position);
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
          console.log("i am at: ", player.position);
          break;
        default:
          break;
      }
    }
  },
  true
);

document.getElementById("btn").addEventListener("click", function () {
  game.pause = true;
  pauseGame(true);
});

document.getElementById("btn2").addEventListener("click", function () {
  game.pause = false;
  pauseGame(false);
});

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
