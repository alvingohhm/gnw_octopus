export function randomInteger(min, max) {
  max = max - min + 1;
  const r = Math.floor(Math.random() * max) + min;
  return r;
}

export function randomSeconds(min, max) {
  return Math.round((randomInteger(min, max) / 1000) * 100) / 100;
}

export const showAsset = (asset) => {
  gsap.set(asset, { visibility: "visible" });
};

export const hideAsset = (asset) => {
  gsap.set(asset, { visibility: "hidden" });
};
