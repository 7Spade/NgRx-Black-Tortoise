/**
 * Bot Store State
 * 
 * Initial state for bot management
 */
import { Bot } from '@domain/account';

export interface BotState {
  /**
   * All bots accessible by current user
   */
  bots: Bot[];
  
  /**
   * Currently selected bot (if any)
   */
  currentBot: Bot | null;
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error state
   */
  error: string | null;
}

export const initialBotState: BotState = {
  bots: [],
  currentBot: null,
  loading: false,
  error: null,
};
