<template>
	<div class="container">
		<article-detail :is-edit="false" />
	</div>
</template>

<script>
import ArticleDetail from '../components/ArticleDetail/index.vue';

export default {
	name: 'CreateArticle',
	components: { ArticleDetail },
};
</script>
