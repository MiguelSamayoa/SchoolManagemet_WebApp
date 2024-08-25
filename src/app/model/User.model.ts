import { Course } from "./Course.model";

export class User {
  userId!:number;
  firstName!: string ;
  lastName!: string;
  email!: string;
  phone!: string;
  imgProfile!: string;
  address!: string;
  gender!: string;
  active!: Boolean;
  role!: Role;
}

export interface UpdateUser{
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string; // Puede ser nulo
  ImgProfile?: File; // Puede ser nulo
  Address?: string; // Puede ser nulo
  Gender?: string; // Puede ser nulo
  RoleId?: number; // Puede ser nulo
}

export class UserWithCourses {
  user!: User;
  course!: Course[];
}

export interface CreateUserDTO {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Phone?: string; // Puede ser nulo
  ImgProfile?: File; // Puede ser nulo
  Address?: string; // Puede ser nulo
  Gender?: string; // Puede ser nulo
  RoleId?: number; // Puede ser nulo
}

export class Role {
  roleId!: number;
  roleName!: string;
}
