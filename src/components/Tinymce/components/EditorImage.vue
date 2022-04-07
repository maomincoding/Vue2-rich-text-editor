<template>
	<div class="upload-container">
		<el-dialog
			:visible.sync="visible"
			:modal="true"
			:modal-append-to-body="false"
			@closed="onClose"
			width="40%"
		>
			<div class="upload-container">
				<el-upload
					:multiple="false"
					:show-file-list="false"
					class="image-uploader"
					drag
					action="#"
					:auto-upload="false"
					:on-change="uploadChange"
				>
					<i class="el-icon-upload" />
					<div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
				</el-upload>
				<div class="image-preview image-app-preview" v-loading="loading">
					<div v-show="imageUrl.length > 1" class="image-preview-wrapper">
						<img :src="imageUrl" />
						<div class="image-preview-action">
							<i class="el-icon-delete" @click="rmImage" />
						</div>
					</div>
				</div>
			</div>
			<el-button type="primary" @click="handleSubmit" size="small">
				确认上传
			</el-button>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'EditorSlideUpload',
	props: {
		color: {
			type: String,
			default: '#1890ff',
		},
		dialogVisible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			loading: false,
			imageUrl: '',
			fileUrl: '',
		};
	},
	computed: {
		visible: {
			get() {
				return this.dialogVisible;
			},
			set(val) {
				this.$emit('update:dialogVisible', val); // visible 改变的时候通知父组件
			},
		},
	},
	methods: {
		onClose() {
			this.$emit('update:dialogVisible', false);
			if (this.imageUrl) {
				window.URL = window.URL || window.webkitURL;
				// const url = window.URL.revokeObjectURL(this.imageUrl);
				this.imageUrl = '';
				this.fileUrl = '';
			}
		},
		rmImage() {
			this.imageUrl = '';
		},
		imageSuccess(val) {
			this.$emit('imageSuccess', val);
		},
		fileToBlob(file) {
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			let blob = null;
			reader.onload = (e) => {
				if (typeof e.target.result === 'object') {
					blob = new Blob([e.target.result]);
				} else {
					blob = e.target.result;
				}

				window.URL = window.URL || window.webkitURL;
				const url = window.URL.createObjectURL(blob);
				this.imageUrl = url;
			};
		},
		async uploadChange(file) {
			const reader = new FileReader();
			this.loading = true;
			const isLt2M = file.raw.size / 1024 / 1024 < 2;
			const isTypeTrue = file.raw.type
				? /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
				: null;
			if (!isTypeTrue) {
				this.$message.error('上传图片格式不对!');
				this.loading = false;
				return false;
			} else if (!isLt2M) {
				this.$message({
					message: '上传文件大小不能超过 2MB!',
					type: 'warning',
				});
				this.loading = false;
				return false;
			} else {
				await reader.readAsDataURL(file.raw);
				reader.addEventListener(
					'load',
					(result) => {
						this.fileUrl = result.target.result;
						this.fileToBlob(file.raw);
						this.loading = false;
					},
					false
				);
			}
		},
		handleSubmit() {
			this.imageSuccess(this.fileUrl);
			this.$emit('update:dialogVisible', false);
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-upload {
	// width: 460px;
	// margin: 0 auto;
	.el-upload-dragger {
		width: 100%;
	}
}
.upload-container {
	width: 100%;
	position: relative;
	margin-bottom: 40px;
	.image-preview {
		.image-preview-wrapper {
			position: relative;
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.image-preview-action {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			cursor: default;
			text-align: center;
			color: #fff;
			opacity: 0;
			font-size: 20px;
			background-color: rgba(0, 0, 0, 0.5);
			transition: opacity 0.3s;
			cursor: pointer;
			text-align: center;
			line-height: 288px;
			.el-icon-delete {
				font-size: 36px;
			}
		}
		&:hover {
			.image-preview-action {
				opacity: 1;
			}
		}
	}
	.image-app-preview {
		height: 288px;
		position: relative;
		border: 1px dashed #d9d9d9;
		.app-fake-conver {
			height: 44px;
			position: absolute;
			width: 100%;
			text-align: center;
			line-height: 64px;
			color: #fff;
		}
	}
}
</style>
