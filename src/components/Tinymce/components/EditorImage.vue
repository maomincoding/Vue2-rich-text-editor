<template>
	<div class="upload-container">
		<el-dialog
			:visible.sync="visible"
			:modal="true"
			:modal-append-to-body="false"
			@closed="onClose"
		>
			<el-upload
				:multiple="true"
				:file-list="fileList"
				:show-file-list="true"
				:on-remove="handleRemove"
				:on-success="handleSuccess"
				:before-upload="beforeUpload"
				class="editor-slide-upload"
				action="https://httpbin.org/post"
				list-type="picture-card"
			>
				<el-button size="small" type="primary"> 点击上传 </el-button>
			</el-upload>
			<el-button type="primary" @click="handleSubmit" size="small">
				确认
			</el-button>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "EditorSlideUpload",
		props: {
			color: {
				type: String,
				default: "#1890ff",
			},
			dialogVisible: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				// dialogVisible: false,
				listObj: {},
				fileList: [],
			};
		},
		computed: {
			visible: {
				get() {
					return this.dialogVisible;
				},
				set(val) {
					this.$emit("update:dialogVisible", val); // visible 改变的时候通知父组件
				},
			},
		},
		methods: {
			onClose() {
				this.$emit("update:dialogVisible", false);
			},
			checkAllSuccess() {
				return Object.keys(this.listObj).every(
					(item) => this.listObj[item].hasSuccess
				);
			},
			handleSubmit() {
				const arr = Object.keys(this.listObj).map((v) => this.listObj[v]);
				if (!this.checkAllSuccess()) {
					this.$message(
						"请等待所有图像成功上传。如果出现网络问题，请刷新页面并重新上传！"
					);
					return;
				}
				this.$emit("successCBK", arr);
				this.listObj = {};
				this.fileList = [];
				this.$emit("update:dialogVisible", false);
			},
			handleSuccess(response, file) {
				const uid = file.uid;
				const objKeyArr = Object.keys(this.listObj);
				for (let i = 0, len = objKeyArr.length; i < len; i++) {
					if (this.listObj[objKeyArr[i]].uid === uid) {
						this.listObj[objKeyArr[i]].url = response.files.file;
						this.listObj[objKeyArr[i]].hasSuccess = true;
						return;
					}
				}
			},
			handleRemove(file) {
				const uid = file.uid;
				const objKeyArr = Object.keys(this.listObj);
				for (let i = 0, len = objKeyArr.length; i < len; i++) {
					if (this.listObj[objKeyArr[i]].uid === uid) {
						delete this.listObj[objKeyArr[i]];
						return;
					}
				}
			},
			beforeUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				const isTypeTrue = file.type
					? /^image\/(jpeg|png|jpg)$/.test(file.type)
					: null;
				if (!isTypeTrue) {
					this.$message.error("上传图片格式不对!");
					return false;
				} else if (!isLt2M) {
					this.$message({
						message: "上传文件大小不能超过 2MB!",
						type: "warning",
					});
					return false;
				} else {
					const _self = this;
					const _URL = window.URL || window.webkitURL;
					const fileName = file.uid;
					this.listObj[fileName] = {};
					return new Promise((resolve) => {
						const img = new Image();
						img.src = _URL.createObjectURL(file);
						img.onload = function () {
							_self.listObj[fileName] = {
								hasSuccess: false,
								uid: file.uid,
								width: this.width,
								height: this.height,
							};
						};
						resolve(true);
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.editor-slide-upload {
		margin-bottom: 20px;
		::v-deep .el-upload--picture-card {
			width: 100%;
		}
	}
	.upload-img {
		font-size: 14px;
		border: 0;
		background: #fff;
		padding: 0 4px;
		width: 44px;
		height: 34px;
		&:hover {
			background: #dee0e2;
			box-shadow: none;
			color: #222f3e;
			border-radius: 2px;
		}
	}
</style>
