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
							<MDinput
								v-model="postForm.title"
								:maxlength="100"
								name="name"
								required
							>
								Title
							</MDinput>
						</el-form-item>

						<div class="postInfo-container">
							<el-row>
								<el-col :span="8">
									<el-form-item
										label-width="60px"
										label="Author:"
										class="postInfo-container-item"
									>
										<el-input v-model="postForm.author" />
									</el-form-item>
								</el-col>

								<el-col :span="10">
									<el-form-item
										label-width="120px"
										label="Publish Time:"
										class="postInfo-container-item"
									>
										<el-date-picker
											v-model="displayTime"
											type="datetime"
											format="yyyy-MM-dd HH:mm:ss"
											placeholder="Select date and time"
										/>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<el-form-item
					style="margin-bottom: 40px"
					label-width="70px"
					label="Summary:"
				>
					<el-input
						v-model="postForm.content_short"
						:rows="1"
						type="textarea"
						class="article-textarea"
						autosize
						placeholder="Please enter the content"
					/>
					<span v-show="contentShortLength" class="word-counter"
						>{{ contentShortLength }}words</span
					>
				</el-form-item>

				<el-form-item prop="content" style="margin-bottom: 30px">
					<Tinymce ref="editor" v-model="postForm.content" :height="400" />
				</el-form-item>

				<el-form-item prop="image_uri" style="margin-bottom: 30px">
					<Upload v-model="postForm.image_uri" />
				</el-form-item>
			</div>
			<el-button
				v-loading="loading"
				style="margin-left: 10px"
				type="success"
				@click="submitForm"
			>
				发布
			</el-button>
		</el-form>
	</div>
</template>

<script>
	import Tinymce from "@/components/Tinymce";
	import Upload from "@/components/Upload/SingleImage3";
	import MDinput from "@/components/MDinput";
	// import { fetchArticle } from '@/api/article'
	// import { searchUser } from '@/api/remote-search'

	const defaultForm = {
		// status: "draft",
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
			MDinput,
			Upload
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
				// set and get is useful when the data
				// returned by the back end api is different from the front end
				// back end return => "2013-06-25 06:59:25"
				// front end need timestamp => 1372114765000
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

			// Why need to make a copy of this.$route here?
			// Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
			// https://github.com/PanJiaChen/vue-element-admin/issues/1221
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
						this.postForm.status = "published";
						this.loading = false;
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			// draftForm() {
			// 	if (
			// 		this.postForm.content.length === 0 ||
			// 		this.postForm.title.length === 0
			// 	) {
			// 		this.$message({
			// 			message: "请填写必要的标题和内容",
			// 			type: "warning",
			// 		});
			// 		return;
			// 	}
			// 	this.$message({
			// 		message: "保存成功",
			// 		type: "success",
			// 		showClose: true,
			// 		duration: 1000,
			// 	});
			// 	this.postForm.status = "draft";
			// }
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
			padding-right: 40px;
			resize: none;
			border: none;
			border-radius: 0px;
			border-bottom: 1px solid #bfcbd9;
		}
	}
</style>
