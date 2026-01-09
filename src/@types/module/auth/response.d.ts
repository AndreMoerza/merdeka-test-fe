type UserAuthorizedResult = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};
