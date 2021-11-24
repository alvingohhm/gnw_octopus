export function randomInteger(min, max) {
  max = max - min + 1;
  const r = Math.floor(Math.random() * max) + min;
  return r;
}

export const showAsset = (asset) => {
  gsap.set(asset, { visibility: "visible" });
};

export const hideAsset = (asset) => {
  gsap.set(asset, { visibility: "hidden" });
};
