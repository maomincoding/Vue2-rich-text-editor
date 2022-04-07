<template>
	<div class="container">
		<div class="list-top">
			<el-input
				placeholder="请输入内容"
				v-model="searchContent"
				class="input-box"
				clearable
				@clear="onInputClear"
			>
				<el-button
					slot="append"
					icon="el-icon-search"
					@click="useSearch"
				></el-button>
			</el-input>
			<router-link to="/create/">
				<el-button type="primary" size="small"> 添加 </el-button>
			</router-link>
		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%"
		>
			<el-table-column
				align="center"
				label="标题"
				show-overflow-tooltip
				prop="title"
			>
				<template slot-scope="scope">
					<router-link to="www" v-if="scope.row.isPush === 1">{{
						scope.row.title
					}}</router-link>
					<span v-else>{{ scope.row.title }}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				label="关键词"
				show-overflow-tooltip
				width="300px"
				prop="keywords"
			>
			</el-table-column>

			<el-table-column
				align="center"
				label="所属栏目"
				prop="category"
				width="120px"
			>
			</el-table-column>

			<el-table-column
				align="center"
				label="发布状态"
				show-overflow-tooltip
				width="300px"
				prop="isPush"
			>
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.isPush === 1 ? 'success' : 'warning'"
						disable-transitions
						>{{ scope.row.isPush === 1 ? '已发布' : '未发布' }}</el-tag
					>
				</template>
			</el-table-column>
			<el-table-column label="发布时间" width="180px" prop="pushTime">
			</el-table-column>

			<el-table-column align="center" label="操作" width="250px">
				<template slot-scope="scope">
					<el-button
						size="small"
						type="primary"
						@click="handleEdit(scope.row.id)"
						>编辑</el-button
					>
					<el-button
						size="small"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom-pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="total"
				:page-size="pageSize"
				:hide-on-single-page="true"
				@current-change="onCurrentPageChange"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script>
import { getArticleList, deleteArticle } from '../api/contentMange';
export default {
	name: 'ArticleList',
	data() {
		return {
			list: [],
			total: 0,
			currentPage: 1,
			searchContent: '',
			listLoading: false,
			pageSize: 10,
		};
	},
	watch: {
		searchContent(val) {
			if (val.length === 0) {
				this.getList({
					page: 1,
					pageSize: this.pageSize,
					searchContent: this.searchContent,
				});
			}
		},
	},
	created() {
		this.getList({
			page: 1,
			pageSize: this.pageSize,
			searchContent: this.searchContent,
		});
	},
	methods: {
		// 获取列表
		getList({ page, pageSize, searchContent }) {
			this.listLoading = true;
			getArticleList({
				page,
				pageSize,
				searchContent,
			})
				.then((res) => {
					this.list = res.data.data.items;
					this.total = res.data.data.count;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
					this.listLoading = false;
				});
		},
		// 页数改变
		onCurrentPageChange(p) {
			this.currentPage = p;
			this.getList({
				page: p,
				pageSize: this.pageSize,
				searchContent: this.searchContent,
			});
		},
		// 编辑
		handleEdit(id) {
			console.log(id);
			this.$router.push(`/edit/${id}`);
		},
		// 删除
		handleDelete(index, row) {
			console.log(index, row);
			this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deleteArticle({
						id: row.id,
					})
						.then(() => {
							if (this.list.length >= 1 || this.currentPage === 1) {
								this.getList({
									page: this.currentPage,
									pageSize: this.pageSize,
									searchContent: this.searchContent,
								});
							} else {
								if (this.currentPage > 1) {
									this.currentPage = this.currentPage - 1;
									this.getList({
										page: this.currentPage,
										pageSize: this.pageSize,
										searchContent: this.searchContent,
									});
								}
							}

							this.$message({
								type: 'success',
								message: '删除成功!',
							});
						})
						.catch((err) => console.error(err));
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 搜索
		useSearch() {
			if (this.searchContent.length > 0) {
				this.getList({
					page: 1,
					pageSize: this.pageSize,
					searchContent: this.searchContent,
				});
			} else {
				this.$message({
					message: '请输入内容',
					type: 'warning',
				});
			}
		},
		// 清空搜索框
		onInputClear() {
			this.getList({
				page: 1,
				pageSize: this.pageSize,
				searchContent: this.searchContent,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
a {
	text-decoration: underline;
}
.app-container {
	padding: 20px;
}
.list-top {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 20px;
}
.list-top .input-box {
	width: 400px;
	margin-right: 20px;
}
.edit-input {
	padding-right: 100px;
}
.cancel-btn {
	position: absolute;
	right: 15px;
	top: 10px;
}
.bottom-pagination {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
}
</style>
