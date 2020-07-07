import { NODE_ENVS } from 'src/types';

/* -------------------------------------------------------------------------- */

export const PORT: number = Number(process.env.PORT) || 4000;

export const NODE_ENV: NODE_ENVS = (process.env.NODE_ENV as NODE_ENVS) || NODE_ENVS.DEVELOPMENT;
