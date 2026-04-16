import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "../types/store";
import { authService } from "../services/authService";


export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    return set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false })
  },

  signUp: async (userName, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      //  gọi api
      await authService.signUp(userName, password, email, firstName, lastName);

      toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (userName, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(userName, password)


      get().setAccessToken(accessToken)
     

      await get().fetchMe();
      toast.success("Chào mừng bạn quay lại với moji")

    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },


  signOut: async () => {
    try {
      await authService.signOut();
      get().clearState();
      toast.success("Đăng xuất thành công")
    } catch (error) {
      console.error(error);
      get().clearState();
      toast.error("Đăng xuất không thành công");

    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user })
    } catch (error) {
      console.error(error);
      set({ accessToken: null, user: null, })
      toast.error("Lỗi khi lấy dữ liệu người dùng");

    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true })

      const { user, fetchMe, setAccessToken } = get();

      const accessToken = await authService.refresh();

      setAccessToken(accessToken);
      

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);

      toast.error("Phiên đăng nhập đã hết hạn.Vui lòng đăng nhập lại");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },



}));
