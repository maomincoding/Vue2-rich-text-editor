import axios from 'axios';

console.log(process.env.VUE_APP_BASE_API);

const service = axios.create({
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 30000, // request timeout
});
service.defaults.headers.post['Content-Type'] =
	'application/json; charset=utf-8';

export default service;
