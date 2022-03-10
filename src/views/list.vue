<template>
	<div class="app-container">
		<router-link to="/create/">
			<el-button type="primary" size="small"> Create </el-button>
		</router-link>
		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%"
		>
			<el-table-column align="center" label="ID" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="Date">
				<template slot-scope="scope">
					<span>{{ scope.row.timestamp }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center" label="Author">
				<template slot-scope="scope">
					<span>{{ scope.row.author }}</span>
				</template>
			</el-table-column>

			<el-table-column min-width="300px" label="Title">
				<template slot-scope="{ row }">
					<router-link :to="'/example/edit/' + row.id" class="link-type">
						<span>{{ row.title }}</span>
					</router-link>
				</template>
			</el-table-column>

			<el-table-column align="center" label="Actions" width="120">
				<template slot-scope="scope">
					<router-link :to="'/edit/' + scope.row.id">
						<el-button type="primary" size="small" icon="el-icon-edit">
							Edit
						</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	// import { fetchList } from '@/api/article'
	export default {
		name: "ArticleList",
		data() {
			return {
				list: [
					{
						id: "1",
						timestamp: "2021",
						author: "maomin",
						title: "标题1",
					},
				],
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
		},
	};
</script>

<style scoped>
	.edit-input {
		padding-right: 100px;
	}
	.cancel-btn {
		position: absolute;
		right: 15px;
		top: 10px;
	}
</style>
