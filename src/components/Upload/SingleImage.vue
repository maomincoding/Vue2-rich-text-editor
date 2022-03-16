<template>
	<div class="upload-container">
		<el-upload
			:data="dataObj"
			:multiple="false"
			:show-file-list="false"
			:on-success="handleImageSuccess"
			class="image-uploader"
			drag
			action="https://httpbin.org/post"
			:before-upload="beforeUpload"
		>
			<i class="el-icon-upload" />
			<div class="el-upload__text">将文件<span class="good-size">(最佳大小：460*288)</span>拖到此处，或<em>点击上传</em></div>
		</el-upload>
		<div class="image-preview image-app-preview" v-loading="loading">
			<div v-show="imageUrl.length > 1" class="image-preview-wrapper">
				<img :src="imageUrl" />
				<div class="image-preview-action">
					<i class="el-icon-delete" @click="rmImage" />
				</div>
			</div>
		</div>
		<!-- <div class="image-preview">
			<div v-show="imageUrl.length > 1" class="image-preview-wrapper">
				<img :src="imageUrl" />
				<div class="image-preview-action">
					<i class="el-icon-delete" @click="rmImage" />
				</div>
			</div>
		</div> -->
	</div>
</template>

<script>
	export default {
		name: "SingleImageUpload",
		props: {
			value: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				loading:false,
				tempUrl: "",
				dataObj: { token: "", key: "" },
			};
		},
		computed: {
			imageUrl() {
				return this.value;
			},
		},
		methods: {
			rmImage() {
				this.emitInput("");
			},
			emitInput(val) {
				this.$emit("input", val);
			},
			handleImageSuccess(file) {
				console.log(file);
				this.loading = false;
				this.emitInput(file.files.file);
			},
			beforeUpload() {
			this.loading = true;
			//   const _self = this
			//   return new Promise((resolve, reject) => {
			//     getToken().then(response => {
			//       const key = response.data.qiniu_key
			//       const token = response.data.qiniu_token
			//       _self._data.dataObj.token = token
			//       _self._data.dataObj.key = key
			//       this.tempUrl = response.data.qiniu_url
			//       resolve(true)
			//     }).catch(err => {
			//       console.log(err)
			//       reject(false)
			//     })
			//   })
			}
		},
	};
</script>

<style lang="scss" scoped>
	.good-size{
		font-size: 12px;
		color: #a3a0a0;
	}
	.upload-container {
		width: 100%;
		position: relative;
		.image-uploader {
			width: 35%;
		}
		.image-preview {
			// width: 200px;
			// height: 200px;
			// position: relative;
			// border: 1px dashed #d9d9d9;
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
