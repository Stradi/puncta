import { Config } from './config.types';

const config: Config = {
  jwt: {
    expiresIn: '15m',
    refreshIn: '7d',
  },
};

export default (): Config => config;
