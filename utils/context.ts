import { createContext } from 'react';

type SaveContextType = {
  user_api: string;
  setUserApi: (s: string) => void;
  user_prompt: string;
  setUserPrompt: (s: string) => void;
  user_model: string;
  setUserModel: (s: string) => void;
};

export const SaveContext = createContext<SaveContextType>({
  user_api: '',
  setUserApi: (s: string) => {},
  user_prompt: '',
  setUserPrompt: (s: string) => {},
  user_model: '',
  setUserModel: (s: string) => {}
});
