import Vue from 'vue';
import VueRouter from 'vue-router';
import list from '../views/list.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'List',
		component: list,
	},
	{
		path: '/create',
		name: 'CreateArticle',
		component: () => import('@/views/create'),
	},
	{
		path: '/edit/:id(\\d+)',
		name: 'EditArticle',
		component: () => import('@/views/edit'),
	},
];

const router = new VueRouter({
	routes,
});

export default router;
