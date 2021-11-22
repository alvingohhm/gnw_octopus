"use strict";

// assisgn all required dom to an object for easy manipulation
// below id name are all tag to the specific avg element
const assets = {
  gameAsset: document.getElementById("game"),
  player: {
    p_pos0: document.getElementById("p-pos0"),
    p_pos0_bag: document.getElementById("p-pos0-bag"),
    p_pos0_hand: document.getElementById("p-pos0-hand"),
    p_life1: document.getElementById("p-life1"),
    p_life2: document.getElementById("p-life2"),
    p_pos1: document.getElementById("p-pos1"),
    p_pos1_bag: document.getElementById("p-pos1-bag"),
    p_pos2: document.getElementById("p-pos2"),
    p_pos2_bag: document.getElementById("p-pos2-bag"),
    p_pos3: document.getElementById("p-pos3"),
    p_pos3_bag: document.getElementById("p-pos3-bag"),
    p_pos4: document.getElementById("p-pos4"),
    p_pos4_bag: document.getElementById("p-pos4-bag"),
    p_pos4: document.getElementById("p-pos4"),
    p_pos4_bag: document.getElementById("p-pos4-bag"),
    p_pos5: document.getElementById("p-pos5"),
    p_pos5_bag: document.getElementById("p-pos5-bag"),
    p_pos5_hand1: document.getElementById("p-pos5-hand1"),
    p_pos5_hand2: document.getElementById("p-pos5-hand2"),
    p_pos5_hand3: document.getElementById("p-pos5-hand3"),
    p_lost: document.getElementById("p-lost"),
    p_lost_anim_set1: document.getElementById("p-lost-anim-set1"),
    p_lost_anim_set2: document.getElementById("p-lost-anim-set2"),
  },
  octopus: {
    o_head: document.getElementById("o-head"),
    leg1: {
      o_pos1_0: document.getElementById("o-pos2-0"),
      o_pos1_1: document.getElementById("o-pos1-1"),
      o_pos1_2: document.getElementById("o-pos1-2"),
    },
    leg2: {
      o_pos2_0: document.getElementById("o-pos2-0"),
      o_pos2_1: document.getElementById("o-pos2-1"),
      o_pos2_2: document.getElementById("o-pos2-2"),
      o_pos2_3: document.getElementById("o-pos2-3"),
    },
    leg3: {
      o_pos3_0: document.getElementById("o-pos3-0"),
      o_pos3_1: document.getElementById("o-pos3-1"),
      o_pos3_2: document.getElementById("o-pos3-2"),
      o_pos3_3: document.getElementById("o-pos3-3"),
      o_pos3_4: document.getElementById("o-pos3-4"),
    },
    leg4: {
      o_pos4_0: document.getElementById("o-pos4-0"),
      o_pos4_1: document.getElementById("o-pos4-1"),
      o_pos4_2: document.getElementById("o-pos4-2"),
      o_pos4_3: document.getElementById("o-pos4-3"),
    },
    leg5: {
      o_pos5_0: document.getElementById("o-pos5-0"),
      o_pos5_1: document.getElementById("o-pos5-1"),
      o_pos5_2: document.getElementById("o-pos5-2"),
    },
  },
};

export default assets;
