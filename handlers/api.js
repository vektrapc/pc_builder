import axios from 'axios';
const http = axios.create({
	baseURL: 'https://app.vektrapc.com/api',
	timeout: 100000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		// ApiToken: 'U0RvR2x0SEZYa0ljSzgxUkFCUHZpRUpvREFlb0FuTFBPSFA=',
	},
});
export default http;
