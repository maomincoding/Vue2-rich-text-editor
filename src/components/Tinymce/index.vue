<template>
	<div
		:class="{ fullscreen: fullscreen }"
		class="tinymce-container"
		:style="{ width: containerWidth }"
	>
		<textarea :id="tinymceId" class="tinymce-textarea" placeholder="1" />
		<div class="editor-custom-btn-container">
			<editorImage
				color="#1890ff"
				class="editor-upload-btn"
				@imageSuccess="imageSuccessCBK"
				:dialogVisible.sync="dialogVisible"
			/>
		</div>
	</div>
</template>

<script>
import editorImage from './components/EditorImage';
import plugins from './plugins';
import toolbar from './toolbar';
import load from './dynamicLoadScript';
import { uploadImg } from '../../api/contentMange';

const tinymceCDN =
	'https://cdn.tiny.cloud/1/18p30epm7mo1v0rxitd87xkgp5gsfiqewygesntzxs41yy79/tinymce/5/tinymce.min.js';

export default {
	name: 'Tinymce',
	components: { editorImage },
	props: {
		id: {
			type: String,
			default: function () {
				return (
					'vue-tinymce-' +
					+new Date() +
					((Math.random() * 1000).toFixed(0) + '')
				);
			},
		},
		value: {
			type: String,
			default: '',
		},
		toolbar: {
			type: Array,
			required: false,
			default() {
				return [];
			},
		},
		menubar: {
			type: String,
			default: 'file edit insert view format table',
		},
		height: {
			type: [Number, String],
			required: false,
			default: 400,
		},
		width: {
			type: [Number, String],
			required: false,
			default: 'auto',
		},
	},
	data() {
		return {
			hasChange: false,
			hasInit: false,
			tinymceId: this.id,
			fullscreen: false,
			dialogVisible: false,
		};
	},
	computed: {
		containerWidth() {
			const width = this.width;
			if (/^[\d]+(\.[\d]+)?$/.test(width)) {
				// matches `100`, `'100'`
				return `${width}px`;
			}
			return width;
		},
	},
	watch: {
		value(val) {
			if (!this.hasChange && this.hasInit) {
				this.$nextTick(() =>
					window.tinymce.get(this.tinymceId).setContent(val || '')
				);
			}
		},
	},
	mounted() {
		this.init();
	},
	activated() {
		if (window.tinymce) {
			this.hasChange = false;
			this.initTinymce();
		}
	},
	deactivated() {
		this.destroyTinymce();
	},
	destroyed() {
		this.destroyTinymce();
	},
	methods: {
		init() {
			// dynamic load tinymce from cdn
			load(tinymceCDN, (err) => {
				if (err) {
					this.$message.error(err.message);
					return;
				}
				this.initTinymce();
			});
		},
		initTinymce() {
			window.tinymce.init({
				selector: `#${this.tinymceId}`,
				language: 'zh_CN',
				height: this.height,
				placeholder: '从这里开始写正文',
				body_class: 'panel-body',
				object_resizing: false,
				resize: false,
				toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
				plugins: plugins,
				menubar: false,
				end_container_on_empty_block: true,
				powerpaste_word_import: 'clean',
				statusbar: false,
				advlist_bullet_styles: 'square',
				advlist_number_styles: 'default',
				// imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
				default_link_target: '_blank',
				link_title: false,
				nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
				init_instance_callback: (editor) => {
					if (this.value) {
						editor.setContent(this.value);
					}
					this.hasInit = true;
					this.$emit('setEditLoading', false);
					// NodeChange Change KeyUp SetContent
					editor.on('Change', () => {
						this.hasChange = true;
						this.$emit('input', editor.getContent());
					});
				},
				setup: (editor) => {
					editor.on('FullscreenStateChanged', (e) => {
						this.fullscreen = e.state;
					});
					editor.ui.registry.addButton('imageButton', {
						icon: 'image',
						tooltip: '上传图片',
						onAction: () => {
							this.dialogVisible = true;
						},
					});
				},
				convert_urls: false,
				// 图片上传
				images_upload_handler(blobInfo, success, failure, progress) {
					const fileData = new FormData();
					fileData.append('file', blobInfo.blob(), blobInfo.filename());
					progress(0);
					uploadImg(fileData)
						.then((res) => {
							success(res.data.data.url);
							progress(100);
						})
						.catch((err) => {
							failure(err);
							console.log(err);
						});
				},
			});
		},
		destroyTinymce() {
			const tinymce = window.tinymce.get(this.tinymceId);
			if (this.fullscreen) {
				tinymce.execCommand('mceFullScreen');
			}

			if (tinymce) {
				tinymce.destroy();
			}
		},
		setContent(value) {
			window.tinymce.get(this.tinymceId).setContent(value);
		},
		getContent() {
			window.tinymce.get(this.tinymceId).getContent();
		},
		imageSuccessCBK(filepath) {
			window.tinymce
				.get(this.tinymceId)
				.insertContent(`<img class="wscnph" src="${filepath}" >`);
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-button--primary {
	background-color: #207ab7;
	border-color: #207ab7;
}
::v-deep .tox-tinymce {
	border-left: 0;
	border-right: 0;
}
.tinymce-container {
	position: relative;
	line-height: normal;
}
.tinymce-container {
	::v-deep {
		.mce-fullscreen {
			z-index: 10000;
		}
	}
}

.tinymce-textarea {
	visibility: hidden;
	z-index: -1;
}

.editor-custom-btn-container {
	position: absolute;
	left: 270px;
	top: 3px;
	z-index: 100;
}

.fullscreen .editor-custom-btn-container {
	z-index: 10000;
	position: fixed;
}

.editor-upload-btn {
	display: inline-block;
}
</style>
