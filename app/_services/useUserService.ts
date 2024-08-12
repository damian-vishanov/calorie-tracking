import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useAlertService } from "./useAlertService";
import { useFetch } from "../_helpers/client";
import { selectCurrentUser } from "../_store/selectors";
import { IUser, setCurrentUser } from "../_store/slices/userSlice";
import { useState } from "react";

export function useUserService(): IUserService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser | null>(null);

  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  return {
    currentUser,
    user,
    users,
    login: async (email, password) => {
      alertService.clear();
      try {
        const currentUser = await fetch.post("/api/account/login", {
          email,
          password,
        });

        dispatch(setCurrentUser(currentUser));

        const returnUrl = searchParams.get("returnUrl") || "/";
        router.push(returnUrl);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    logout: async () => {
      await fetch.post("/api/account/logout");
      router.push("/account/login");
    },
    getAll: async (page, pageSize) => {
      let path = "/api/admin/users";
      if (page && pageSize) {
        path += `?page=${page}&pageSize=${pageSize}`;
      }
      const getUsers = await fetch.get(path);
      setUsers(getUsers);
    },
    getById: async (id) => {
      try {
        const user = await fetch.get(`/api/admin/users?id=${id}`);
        setUser(user);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getCurrent: async () => {
      if (!currentUser?.id) {
        const currentUser = await fetch.get("/api/users/current");
        dispatch(setCurrentUser(currentUser));
      }
    },
    create: async (user) => {
      await fetch.post("/api/admin/users", user);
    },
    update: async (id, params) => {
      await fetch.put(`/api/admin/users/${id}`, params);
    },
    delete: async (id) => {
      await fetch.delete(`/api/admin/users/${id}`);
    },
    // create: async (user) => {
    //     await fetch.post('/api/users', user);
    // },
    // update: async (id, params) => {
    //     await fetch.put(`/api/users/${id}`, params);

    //     // update current user if the user updated their own record
    //     if (id === currentUser?.id) {
    //         userStore.setState({ currentUser: { ...currentUser, ...params } })
    //     }
    // },
    // delete: async (id) => {
    //     // set isDeleting prop to true on user
    //     userStore.setState({
    //         users: users!.map(x => {
    //             if (x.id === id) { x.isDeleting = true; }
    //             return x;
    //         })
    //     });

    //     // delete user
    //     const response = await fetch.delete(`/api/users/${id}`);

    //     // remove deleted user from state
    //     userStore.setState({ users: users!.filter(x => x.id !== id) });

    //     // logout if the user deleted their own record
    //     if (response.deletedSelf) {
    //         router.push('/account/login');
    //     }
    // }
  };
}

// interfaces

interface IUserStore {
  users?: IUser[];
  user?: IUser;
  currentUser?: IUser;
}

interface IUserCreate extends IUser {
  password: string;
}

export interface IUserService extends IUserStore {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAll: (page?: number, pageSize?: number) => Promise<void>;
  getById: (id: string) => Promise<void>;
  getCurrent: () => Promise<void>;
  create: (user: IUserCreate) => Promise<void>;
  update: (id: string, params: IUser) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
