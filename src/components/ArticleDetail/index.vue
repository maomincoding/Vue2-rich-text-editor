<template>
	<div
		class="createPost-container"
		v-loading.fullscreen.lock="loading"
		:element-loading-text="[isEdit ? '更新中' : '发布中']"
		element-loading-spinner="el-icon-loading"
	>
		<el-form
			ref="postForm"
			:model="postForm"
			:rules="rules"
			label-position="left"
			class="form-container"
		>
			<div class="createPost-main-container">
				<el-form-item
					style="margin-bottom: 40px"
					prop="title"
					class="postInfo-container-item"
				>
					<el-input
						v-model="postForm.title"
						type="textarea"
						class="article-textarea"
						autosize
						maxlength="100"
						show-word-limit
						placeholder="请在这里输入标题（最多100个字）"
					/>
				</el-form-item>
				<el-form-item
					prop="content"
					style="margin-bottom: 30px"
					v-loading="editLoading"
				>
					<div style="height: 750px">
						<keep-alive :max="10">
							<Tinymce
								ref="editor"
								v-model="postForm.content"
								:height="750"
								@setEditLoading="setEditLoading"
							/>
						</keep-alive>
					</div>
				</el-form-item>
				<el-form-item
					style="margin-bottom: 40px"
					label-width="80px"
					label="文章摘要"
					class="postInfo-container-item"
				>
					<el-input
						v-model="postForm.abstract"
						type="textarea"
						class="article-textarea-l"
						:rows="5"
						maxlength="100"
						show-word-limit
						placeholder="请输入文章摘要"
					/>
				</el-form-item>
				<el-form-item
					prop="cover"
					label-width="80px"
					style="margin-bottom: 30px"
					class="postInfo-container-item"
					label="文章封面"
				>
					<Upload v-model="postForm.cover" />
				</el-form-item>

				<el-form-item
					label="关键词"
					prop="keywords"
					label-width="80px"
					class="postInfo-container-item"
				>
					<el-tag
						:key="tag"
						v-for="tag in dynamicTags"
						closable
						:disable-transitions="false"
						@close="handleClose(tag)"
					>
						{{ tag }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model="inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm"
						maxlength="6"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput"
						>+ 增加关键词</el-button
					>
				</el-form-item>
				<el-form-item
					label="所属栏目"
					label-width="80px"
					prop="category"
					class="postInfo-container-item"
				>
					<el-select v-model="postForm.category" placeholder="请选择所属栏目">
						<el-option
							v-for="item in categoryData"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="!isEdit"
					label-width="80px"
					label="定时发布"
					class="postInfo-container-item"
				>
					<el-date-picker
						v-model="pushTime"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						:picker-options="pickerOptions"
						placeholder="选择发布时间"
					/>
				</el-form-item>
			</div>
			<div class="bottom-edit-inner">
				<el-button type="success" @click="submitForm">
					{{ isEdit ? '更新' : '发布' }}文章
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import Upload from './Upload/SingleImage';
import categoryData from './categoryData';
import { parseTime } from '@/utils/index';
import { setArticle, articleDetail } from '../../api/contentMange';

const defaultForm = {
	title: '', // 文章标题
	content: '', // 文章内容
	abstract: '', // 文章摘要
	cover: '', // 文章封面
	category: '', // 所属栏目
	pushTime: undefined, // 发布时间
	isPush: 0, // 是否发布
	keywords: '', // 关键词
};
const statusObj = {
	title: '标题',
	content: '正文',
	cover: '封面',
	category: '栏目',
	keywords: '关键词',
};
export default {
	name: 'ArticleDetail',
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
			this.$nextTick(() => {
				if (rule.field === 'keywords') {
					if (this.postForm.keywords.length > 0) {
						callback();
					} else {
						callback(new Error(statusObj[rule.field] + '为必填项'));
					}
				} else {
					if (value === '') {
						console.log(value);
						callback(new Error(statusObj[rule.field] + '为必填项'));
						// this.$message({
						//     message: '请填写必填项',
						//     type: 'warning'
						// });
					} else {
						callback();
					}
				}
			});
		};

		return {
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				},
				selectableRange: `${parseTime(Date.now(), '{h}:{i}:{s}')} - 23:59:59`,
			},
			dynamicTags: [],
			inputVisible: false,
			inputValue: '',
			postForm: Object.assign({}, defaultForm),
			loading: false,
			rules: {
				cover: [
					{
						required: true,
						trigger: 'change',
						validator: validateRequire,
					},
				],
				title: [
					{
						required: true,
						trigger: 'blur',
						validator: validateRequire,
					},
				],
				content: [
					{
						required: true,
						trigger: 'blur',
						validator: validateRequire,
					},
				],
				category: [
					{
						required: true,
						trigger: 'change',
						validator: validateRequire,
					},
				],
				keywords: [
					{
						required: true,
						trigger: 'blur',
						validator: validateRequire,
					},
				],
			},
			tempRoute: {},
			editLoading: true,
		};
	},
	computed: {
		pushTime: {
			get() {
				return this.postForm.pushTime;
			},
			set(val) {
				this.postForm.pushTime = parseTime(new Date(val).getTime());
			},
		},
		categoryData: {
			get() {
				return categoryData;
			},
		},
	},
	watch: {
		dynamicTags(v) {
			this.postForm.keywords = v.join();
		},
	},
	created() {
		if (this.isEdit) {
			const id = this.$route.params && this.$route.params.id;
			this.getArticleDetail(id);
		}
		this.tempRoute = Object.assign({}, this.$route);
	},
	methods: {
		// 获取文章详情
		getArticleDetail(id) {
			articleDetail({
				id,
			}).then((res) => {
				this.postForm = res.data.data;
				this.dynamicTags = res.data.data.keywords.split(',');
			});
		},

		setEditLoading(v) {
			this.editLoading = v;
		},
		handleClose(tag) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				if (this.dynamicTags.length <= 5) {
					this.dynamicTags.push(inputValue);
				} else {
					this.$message({
						message: '关键词最多只能添加6个',
						type: 'warning',
					});
				}
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		// 发布文章
		submitForm() {
			console.log(this.postForm);
			this.$refs.postForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					// 立即发布
					if (!this.postForm.pushTime) {
						this.postForm.isPush = 1;
						this.postForm.pushTime = parseTime(new Date().getTime());
					} else if (
						new Date(this.postForm.pushTime).getTime() - new Date().getTime() <
						30000
					) {
						this.postForm.isPush = 1;
					}

					const formData = new FormData();
					for (const key in this.postForm) {
						if (Object.hasOwnProperty.call(this.postForm, key)) {
							const element = this.postForm[key];
							formData.append(key, element);
						}
					}

					setArticle(formData)
						.then(() => {
							this.$notify({
								title: '成功',
								message: `${this.isEdit ? '更新' : '发布'}文章成功`,
								type: 'success',
								duration: 2000,
							});
							this.$router.push('/');
							this.loading = false;
						})
						.catch((err) => {
							this.loading = false;
							console.error(err);
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.bottom-edit-inner,
.form-container {
	width: 1200px;
	margin-left: auto;
	margin-right: auto;
}
.form-container {
	box-shadow: 0px 0px 10px #dad8d8;
	padding: 30px 40px;
	background-color: #fff;
}
.createPost-container {
	position: relative;
	.createPost-main-container {
		.postInfo-container {
			position: relative;
			margin-bottom: 10px;

			&:after {
				content: '';
				display: table;
				clear: both;
			}
			.postInfo-container-item {
				float: left;
			}
		}
	}
}
.article-textarea ::v-deep {
	textarea {
		padding-right: 40px;
		resize: none;
		border: none;
		border-radius: 0px;
		font-weight: 600;
		font-size: 34px;
		border-bottom: 1px solid #bfcbd9;
	}
}
.article-textarea-l {
	width: 460px;
}
.el-tag + .el-tag {
	margin-left: 10px;
}
::v-deep .el-form-item__content button {
	&:nth-child(1) {
		margin-left: 0;
	}
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
