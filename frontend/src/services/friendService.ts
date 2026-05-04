import api from '../lib/axios'

const friendService = {
    async searchByUserName(userName: string) {
        console.log("input:", userName);
        const res = await api.get(`/users/search?userName=${userName}`);

        return res.data.user;
    },

    async sendFriendRequest(to: string, message?: string) {
        console.log({to, message})
        const res = await api.post("/friends/requests", { to, message });
        return res.data.message;
    },
}


export default friendService;