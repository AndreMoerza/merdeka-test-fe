interface User {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  __entity: "User";
}
