import axios from "axios";

export const axiosConfig1 = axios.create({
	baseURL: "https://stockfish.online/api/s/v2.php",
	timeout: 5000,
	method: "get",
});
