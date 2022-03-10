<template>
	<div class="createPost-container">
		<el-form
			ref="postForm"
			:model="postForm"
			:rules="rules"
			class="form-container"
		>
			<div class="createPost-main-container">
				<el-row>
					<el-col :span="24">
						<el-form-item style="margin-bottom: 40px" prop="title">
							<el-form-item
								label-width="100px"
								label="文章标题："
								class="postInfo-container-item"
							>
								<el-input
									v-model="postForm.title"
									type="textarea"
									class="article-textarea"
									autosize
									placeholder="请输入文章标题"
								/>
							</el-form-item>
						</el-form-item>

						<div class="postInfo-container">
							<el-row>
								<el-col :span="8">
									<el-form-item
										label-width="100px"
										label="所属栏目："
										class="postInfo-container-item"
									>
										<el-select v-model="postForm.category" placeholder="请选择">
											<el-option
												v-for="item in categoryData"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>

								<el-col :span="10">
									<el-form-item
										label-width="100px"
										label="发布时间："
										class="postInfo-container-item"
									>
										<el-date-picker
											v-model="displayTime"
											type="datetime"
											format="yyyy-MM-dd HH:mm:ss"
											placeholder="选择发布时间"
										/>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<el-form-item
					style="margin-bottom: 40px"
					label-width="100px"
					label="文章摘要："
				>
					<el-input
						v-model="postForm.content_short"
						type="textarea"
						class="article-textarea-l"
						:rows="2"
						placeholder="请输入文章摘要"
					/>
					<span v-show="contentShortLength" class="word-counter"
						>{{ contentShortLength }}字</span
					>
				</el-form-item>

				<el-form-item prop="content" style="margin-bottom: 30px">
					<Tinymce ref="editor" v-model="postForm.content" :height="400" />
				</el-form-item>

				<el-form-item
					prop="image_uri"
					style="margin-bottom: 30px"
					label-width="100px"
					label="文章封面："
				>
					<Upload v-model="postForm.image_uri" />
				</el-form-item>

				<el-button
					v-loading="loading"
					style="margin-left: 10px"
					type="success"
					@click="submitForm"
				>
					发布
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import Tinymce from "@/components/Tinymce";
	import Upload from "@/components/Upload/SingleImage";
	// import { fetchArticle } from '@/api/article'

	const defaultForm = {
		title: "", // 文章题目
		content: "", // 文章内容
		content_short: "", // 文章摘要
		image_uri: "", // 文章图片
		display_time: undefined, // 前台展示时间
		id: undefined,
	};

	export default {
		name: "ArticleDetail",
		components: {
			Tinymce,
			Upload,
		},
		props: {
			isEdit: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			const validateRequire = (rule, value, callback) => {
				if (value === "") {
					this.$message({
						message: rule.field + "为必传项",
						type: "error",
					});
					callback(new Error(rule.field + "为必传项"));
				} else {
					callback();
				}
			};
			return {
				postForm: Object.assign({}, defaultForm),
				loading: false,
				category: "3",
				categoryData: [
					{
						value: "1",
						label: "企业新闻",
					},
					{
						value: "2",
						label: "行业资讯",
					},
					{
						value: "3",
						label: "展会活动",
					},
					{
						value: "4",
						label: "视频中心",
					},
				],
				rules: {
					image_uri: [{ validator: validateRequire }],
					title: [{ validator: validateRequire }],
					content: [{ validator: validateRequire }],
				},
				tempRoute: {},
			};
		},
		computed: {
			contentShortLength() {
				return this.postForm.content_short.length;
			},
			displayTime: {
				get() {
					return +new Date(this.postForm.display_time);
				},
				set(val) {
					this.postForm.display_time = new Date(val);
				},
			},
		},
		created() {
			if (this.isEdit) {
				// const id = this.$route.params && this.$route.params.id
				// this.fetchData(id)
			}
			this.tempRoute = Object.assign({}, this.$route);
		},
		methods: {
			// fetchData(id) {
			//   fetchArticle(id).then(response => {
			//     this.postForm = response.data

			//     // just for test
			//     this.postForm.title += `   Article Id:${this.postForm.id}`
			//     this.postForm.content_short += `   Article Id:${this.postForm.id}`

			//     // set tagsview title
			//     this.setTagsViewTitle()

			//     // set page title
			//     this.setPageTitle()
			//   }).catch(err => {
			//     console.log(err)
			//   })
			// },
			setTagsViewTitle() {
				const title = "Edit Article";
				const route = Object.assign({}, this.tempRoute, {
					title: `${title}-${this.postForm.id}`,
				});
				this.$store.dispatch("tagsView/updateVisitedView", route);
			},
			setPageTitle() {
				const title = "Edit Article";
				document.title = `${title} - ${this.postForm.id}`;
			},
			submitForm() {
				console.log(this.postForm);
				this.$refs.postForm.validate((valid) => {
					if (valid) {
						this.loading = true;
						this.$notify({
							title: "成功",
							message: "发布文章成功",
							type: "success",
							duration: 2000,
						});
						this.loading = false;
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.createPost-container {
		position: relative;

		.createPost-main-container {
			padding: 40px 45px 20px 50px;

			.postInfo-container {
				position: relative;
				margin-bottom: 10px;
				&:after {
					content: "";
					display: table;
					clear: both;
				}
				.postInfo-container-item {
					float: left;
				}
			}
		}

		.word-counter {
			width: 40px;
			position: absolute;
			right: 10px;
			top: 0px;
		}
	}

	.article-textarea ::v-deep {
		textarea {
			width: 600px;
			padding-right: 40px;
			resize: none;
			border: none;
			border-radius: 0px;
			border-bottom: 1px solid #bfcbd9;
		}
	}
	.article-textarea-l ::v-deep {
		textarea {
			width: 600px;
		}
	}
</style>
