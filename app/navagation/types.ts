// navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    AccountCreation: undefined; // This is the AccountCreation screen
    Logout: undefined; // This is the logout screen
    FavoriteTeams: { userId: number; username?: string };
  };

// Default export for compatibility
export default RootStackParamList;
  