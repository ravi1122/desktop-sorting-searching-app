import { MOBILE_DEVICE_MAX_WIDTH, MOBILE_DEVICE_MAX_HEIGHT } from "./constants";

export const isMobile = () => {
  return (
    window.innerWidth <= MOBILE_DEVICE_MAX_WIDTH &&
    window.innerHeight <= MOBILE_DEVICE_MAX_HEIGHT
  );
};
