<template>
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
			<div class="el-upload__text">
				将图片<span class="good-size">(最佳尺寸：460*288)</span>拖到此处，或<em
					>点击上传</em
				>
			</div>
		</el-upload>
		<div class="image-preview image-app-preview" v-show="imageUrl">
			<div class="image-preview-wrapper" v-loading="loading">
				<img :src="imageUrl" @load="loadImg" />
				<div class="image-preview-action">
					<i class="el-icon-delete" @click="rmImage" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SingleImageUpload',
	props: {
		value: {
			default: '',
		},
	},
	watch: {
		value(val) {
			this.imageUrl = val;
		},
	},
	data() {
		return {
			imageUrl: '',
			loading: true,
		};
	},
	methods: {
		// 删除图片
		rmImage() {
			this.$emit('input', '');
			this.imageUrl = '';
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
		// 上传图片
		async uploadChange(file) {
			const isLt2M = file.raw.size / 1024 / 1024 < 2;
			const isTypeTrue = file.raw.type
				? /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
				: null;
			if (!isTypeTrue) {
				this.$message.error('上传图片格式不对!');
				this.imageUrl = '';
				return false;
			} else if (!isLt2M) {
				this.$message({
					message: '上传文件大小不能超过 2MB!',
					type: 'warning',
				});
				this.imageUrl = '';
				return false;
			} else {
				this.$nextTick(() => {
					this.fileToBlob(file.raw);
					this.$emit('input', file.raw);
				});
			}
		},
		loadImg() {
			console.log('图片加载完毕');
			this.loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.good-size {
	font-size: 12px;
	color: #a3a0a0;
}
::v-deep .el-upload {
	width: 460px;
	height: 288px;
	margin-right: 20px;
	.el-upload-dragger {
		width: 100%;
		height: 100%;
		.el-icon-upload {
			margin-top: 90px;
		}
	}
}
.upload-container {
	width: 100%;
	position: relative;
	display: flex;
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
		width: 460px;
		height: 288px;
		position: relative;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
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
