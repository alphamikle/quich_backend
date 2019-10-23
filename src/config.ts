import { config } from 'dotenv';

const { IS_IN_DOCKER } = process.env;
export const output = IS_IN_DOCKER === 'true' ? {} : config();
