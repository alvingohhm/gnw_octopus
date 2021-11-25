"use strict";
import assets from "./assets.js";
import { showAsset, hideAsset } from "./utils.js";

const scoreDisplay = {
  flags_0: [1, 1, 1, 0, 1, 1, 1],
  flags_1: [0, 0, 1, 0, 0, 0, 1],
  flags_2: [0, 1, 1, 1, 1, 1, 0],
  flags_3: [0, 1, 1, 1, 0, 1, 1],
  flags_4: [1, 0, 1, 1, 0, 0, 1],
  flags_5: [1, 1, 0, 1, 0, 1, 1],
  flags_6: [1, 1, 0, 1, 1, 1, 1],
  flags_7: [0, 1, 1, 0, 0, 0, 1],
  flags_8: [1, 1, 1, 1, 1, 1, 1],
  flags_9: [1, 1, 1, 1, 0, 1, 1],

  // clearDigit: function (targetSegment) {
  //   const segmentsObj = Object.keys(assets.game[`seg${targetSegment}`]);
  //   for (const segment of segmentsObj) {
  //     hideAsset(assets.game[`seg${targetSegment}`][segment]);
  //   }
  // },

  // helper function
  processDigit: function (targetSegment, targetFlags) {
    // this.clearDigit(targetSegment);
    targetFlags.map((flag, index) => {
      if (flag) {
        showAsset(
          assets.game[`seg${targetSegment}`][`seg${targetSegment}_${index}`]
        );
      } else {
        hideAsset(
          assets.game[`seg${targetSegment}`][`seg${targetSegment}_${index}`]
        );
      }
    });
  },

  init: function () {
    this.processDigit(4, this.flags_0);
  },

  display: function (num) {
    const digits = num.toString().split("");
    if (digits.length <= 4) {
      digits.reverse().map((digit, index) => {
        let targetSegment = 4 - index;
        const targetFlags = this[`flags_${digit}`];
        this.processDigit(targetSegment, targetFlags);
      });
    }
  },
};

export default scoreDisplay;
