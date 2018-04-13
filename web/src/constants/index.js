import { isTouchscreenDevice } from "../utils";

export const IS_DEVICE_TOUCHSCREEN = isTouchscreenDevice();

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
