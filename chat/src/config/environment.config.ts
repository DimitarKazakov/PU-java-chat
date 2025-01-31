interface EnvironmentConfig {
  APIBaseURL: string;
}

const getConfig = (): EnvironmentConfig => {
  return {
    APIBaseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  };
};

export const envConfig = getConfig();
