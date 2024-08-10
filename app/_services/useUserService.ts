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

  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  return {
    currentUser,
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
    getAll: async () => {
      const getUsers = await fetch.get("/api/admin/users");
      setUsers(getUsers);
    },
    // getById: async (id) => {
    //     userStore.setState({ user: undefined });
    //     try {
    //         userStore.setState({ user: await fetch.get(`/api/users/${id}`) });
    //     } catch (error: any) {
    //         alertService.error(error);
    //     }
    // },
    getCurrent: async () => {
      if (!currentUser?.id) {
        const currentUser = await fetch.get("/api/users/current");
        dispatch(setCurrentUser(currentUser));
      }
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
  currentUser?: IUser;
}

export interface IUserService extends IUserStore {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAll: () => Promise<void>;
  // getById: (id: string) => Promise<void>,
  getCurrent: () => Promise<void>;
  // create: (user: IUser) => Promise<void>,
  // update: (id: string, params: Partial<IUser>) => Promise<void>,
  // delete: (id: string) => Promise<void>
}
