"use strict";
import assets from "./assets.js";

const showAsset = (asset) => {
  asset.style.visibility = "visible";
};

const hideAsset = (asset) => {
  asset.style.visibility = "hidden";
};

// assets.player.p_pos0_bag.style.visibility = "hidden";
hideAsset(assets.player.p_pos5_hand2);
