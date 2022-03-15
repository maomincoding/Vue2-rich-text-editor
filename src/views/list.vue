<template>
	<div class="app-container">
		<div class="list-top">
			<el-input placeholder="请输入内容" v-model="seachInput" class="input-box">
				<el-button slot="append" icon="el-icon-search"></el-button>
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
			<el-table-column align="center" label="ID" width="100px">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="标题">
				<template slot-scope="scope">
					<router-link :to="scope.row.url" class="link-type">
						<span>{{ scope.row.title }}</span>
					</router-link>
				</template>
			</el-table-column>

			<el-table-column align="center" label="所属栏目" width="120px">
				<template slot-scope="scope">
					<span>{{ scope.row.category }}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="访问次数" width="120px">
				<template slot-scope="scope">
					<span>{{ scope.row.count }}</span>
				</template>
			</el-table-column>

			<el-table-column label="定时时间" width="180px">
				<template slot-scope="scope">
					<span>{{ scope.row.setTime }}</span>
				</template>
			</el-table-column>

			<el-table-column label="发布时间" width="180px">
				<template slot-scope="scope">
					<span>{{ scope.row.pushTime }}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200px">
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
			<el-pagination background layout="prev, pager, next" :total="0">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: "ArticleList",
		data() {
			return {
				list: [
					{
						id: "1",
						title: "标题1",
						count: "2",
						url: "#",
						category: "视频中心",
						pushTime: "2022.3.1 10:00",
						setTime: "2022.3.1 08:00",
					},
				],
				seachInput: "",
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 20,
				},
			};
		},
		created() {
			// this.getList()
		},
		methods: {
			// getList() {
			//   this.listLoading = true
			//   fetchList(this.listQuery).then(response => {
			//     this.list = response.data.items
			//     this.total = response.data.total
			//     this.listLoading = false
			//   })
			// }

			// 编辑
			handleEdit(id) {
				console.log(id);
				this.$router.push(`/edit/${id}`);
			},
			// 删除
			handleDelete(index, row) {
				console.log(index, row);
				this.$confirm("此操作将永久删除该资讯, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						this.$message({
							type: "success",
							message: "删除成功!",
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
		},
	};
</script>

<style scoped>
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
	.bottom-pagination{
		display: flex;
		justify-content: flex-end;
		margin-top:20px ;
	}
</style>
