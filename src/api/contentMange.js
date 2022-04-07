// 内容管理API
import request from '@/utils/request';

const baseUrl = 'http://localhost:6600'; // 测试

// 获取文章列表
export function getArticleList(data) {
	return request({
		url: `${baseUrl}/api/content/articleList`,
		method: 'post',
		data,
	});
}

// 添加/编辑文章
export function setArticle(data) {
	return request({
		url: `${baseUrl}/api/content/setArticle`,
		method: 'post',
		data,
	});
}

// 上传图片（正文）
export function uploadImg(data) {
	return request({
		url: `${baseUrl}/api/content/uploadImg`,
		method: 'post',
		data,
	});
}

// 上传图片（正文）
export function articleDetail(data) {
	return request({
		url: `${baseUrl}/api/content/articleDetail`,
		method: 'post',
		data,
	});
}

// 删除文章
export function deleteArticle(data) {
	return request({
		url: `${baseUrl}/api/content/deleteArticle`,
		method: 'post',
		data,
	});
}
