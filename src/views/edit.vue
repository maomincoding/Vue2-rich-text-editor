<template>
	<div class="container">
		<article-detail :is-edit="true" />
	</div>
</template>

<script>
import ArticleDetail from '../components/ArticleDetail/index.vue';

export default {
	name: 'EditForm',
	components: { ArticleDetail },
};
</script>
