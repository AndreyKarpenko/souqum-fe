export type EnvConfig = {
  BASE_URL: string;
};

export type EnvConfigName = 'dev' | 'stage' | 'prod';

export type AppEnvPickerState = { env: EnvConfigName };
