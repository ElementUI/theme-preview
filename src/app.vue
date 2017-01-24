<template>
  <div class="wrapper">
    <header
      :style="{ 'background-color': primaryColor }">
      <img
        src="./assets/element-logo.svg"
        alt="element-logo"
        class="header-logo">
      <ul class="header-operations">
        <li @click="showThemeDialog">{{ langConfig.header.switch[lang] }}</li>
        <li
          class="header-download"
          :class="{ 'is-available': canDownload }"
          @click="downloadZip">
          {{ langConfig.header.download[lang] }}
        </li>
        <li @click="showHelpDialog">{{ langConfig.header.help[lang] }}</li>
        <li>
          <span
            @click="switchLang('/zh-CN')"
            :class="{ 'is-active': lang === '/zh-CN' }"
            class="header-lang">
            中文
          </span>
          <span>/</span>
          <span
            @click="switchLang('/en-US')"
            :class="{ 'is-active': lang === '/en-US' }"
            class="header-lang">
            En
          </span>
        </li>
      </ul>
    </header>
    <el-row class="container">
      <el-col :span="4" class="menu">
        <el-menu default-active="1">
          <el-menu-item index="1">{{ langConfig.menu.pageOne[lang] }}</el-menu-item>
          <el-menu-item index="2">{{ langConfig.menu.pageTwo[lang] }}</el-menu-item>
          <el-menu-item index="3">{{ langConfig.menu.pageThree[lang] }}</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" class="content">
        <el-breadcrumb>
          <el-breadcrumb-item>{{ langConfig.breadcrumb.main[lang] }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ langConfig.breadcrumb.project[lang] }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ langConfig.breadcrumb.page[lang] }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form inline :model="query" label-position="right" label-width="60px" class="query-form">
          <el-form-item :label="langConfig.query.name[lang]" prop="name">
            <el-input v-model="query.name" :placeholder="langConfig.query.nameHolder[lang]"></el-input>
          </el-form-item>
          <el-form-item :label="langConfig.query.date[lang]" prop="date">
            <el-date-picker
                v-model="query.date"
                type="daterange"
                :placeholder="langConfig.query.dateHolder[lang]">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">{{ langConfig.query.search[lang] }}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData[lang]" class="table" stripe border>
          <el-table-column prop="date" :label="langConfig.table.date[lang]" sortable width="200"></el-table-column>
          <el-table-column prop="name" :label="langConfig.table.name[lang]" width="200"></el-table-column>
          <el-table-column prop="address" :label="langConfig.table.address[lang]"></el-table-column>
          <el-table-column prop="zip" :label="langConfig.table.zip[lang]" width="200"></el-table-column>
          <el-table-column :label="langConfig.table.operations[lang]" width="160">
            <template scope="scope">
              <el-button size="small">{{ langConfig.table.edit[lang] }}</el-button>
              <el-button size="small" type="danger">{{ langConfig.table.delete[lang] }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="100"
          class="pagination">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog v-model="themeDialogVisible" :title="langConfig.header.switch[lang]" size="tiny">
      <el-form
        :model="colors"
        :rules="rules"
        ref="form"
        label-position="top"
        label-width="70px">
        <el-form-item :label="langConfig.form.theme[lang]" prop="primary">
          <el-input type="color" v-model="colors.primary" class="color-input"></el-input>
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="submitForm">{{ langConfig.form.switch[lang] }}</el-button>
          <el-button @click="resetForm">{{ langConfig.form.reset[lang] }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="helpDialogVisible" :title="langConfig.help.title[lang]">
      <div v-html="langConfig.help.content[lang]" class="help"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="helpDialogVisible = false">{{ langConfig.help.ok[lang] }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import generateColors from './utils/color';
  import objectAssign from 'object-assign';
  import blobUtil from 'blob-util';
  import langConfig from './lang';
  import tableData from './table-data';
  import Vue from 'vue';
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';

  export default {
    name: 'app',

    data() {
      const colorValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.langConfig.validate.required[this.lang]));
        } else if (!/^#[\dabcdef]{6}$/i.test(value)) {
          return callback(new Error(this.langConfig.validate.format[this.lang]));
        } else {
          callback();
        }
      };
      return {
        colors: {
          primary: '#20a0ff'
        },
        rules: {
          primary: [
            { validator: colorValidator, trigger: 'blur' }
          ]
        },
        originalStylesheetCount: -1,
        originalStyle: '',
        langConfig,
        tableData,
        primaryColor: '#20a0ff',
        themeDialogVisible: false,
        helpDialogVisible: false,
        zip: null,
        styleFiles: [],
        fontFiles: ['element-icons.eot', 'element-icons.svg', 'element-icons.ttf', 'element-icons.woff'],
        fonts: [],
        canDownload: false,
        query: {
          name: '',
          date: []
        }
      };
    },

    computed: {
      lang() {
        return this.$route.path;
      }
    },

    watch: {
      '$route.path': {
        immediate: true,
        handler(val) {
          if (val === '/zh-CN') {
            Vue.config.lang = 'zh-cn';
          } else {
            Vue.config.lang = 'en';
          }
        }
      }
    },

    methods: {
      switchLang(lang) {
        this.$router.push(lang);
      },

      showThemeDialog() {
        this.themeDialogVisible = true;
      },

      showHelpDialog() {
        this.helpDialogVisible = true;
      },

      resetZip() {
        this.zip = new JSZip();
        this.fonts.forEach((font, index) => {
          this.zip.file(`fonts/${ this.fontFiles[index] }`, font.data);
        });
      },

      writeNewStyle() {
        let cssText = this.originalStyle;
        Object.keys(this.colors).forEach(key => {
          cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]);
        });

        if (this.originalStylesheetCount === document.styleSheets.length) {
          const style = document.createElement('style');
          style.innerText = cssText;
          document.head.appendChild(style);
        } else {
          document.head.lastChild.innerText = cssText;
        }
      },

      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.themeDialogVisible = false;
            this.primaryColor = this.colors.primary;
            this.colors = objectAssign({}, this.colors, generateColors(this.colors.primary));

            this.canDownload = true;
            this.writeNewStyle();
          } else {
            return false;
          }
        });
      },

      downloadZip() {
        if (!this.canDownload) return;
        this.resetZip();
        this.styleFiles.forEach(file => {
          let cssText = file.data;
          Object.keys(this.colors).forEach(key => {
            cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]);
          });
          const css = blobUtil.createBlob([cssText], { type: 'text/css' });
          this.zip.file(file.name, css);
        });
        this.zip.generateAsync({ type: 'blob' })
          .then(blob => {
            FileSaver.saveAs(blob, `element-${ this.primaryColor }.zip`);
          });
      },

      resetForm() {
        this.$refs.form.resetFields();
      },

      getStyleTemplate(data) {
        const colorMap = {
          '#20a0ff': 'primary',
          '#0190fe': 'secondary',
          '#fbfdff': 'darkWhite',
          '#1f2d3d': 'baseBlack',
          '#324157': 'lightBlack',
          '#48576a': 'extraLightBlack',
          '#8391a5': 'baseSilver',
          '#97a8be': 'lightSilver',
          '#bfcbd9': 'extraLightSilver',
          '#d1dbe5': 'baseGray',
          '#e4e8f1': 'lightGray',
          '#eef1f6': 'extraLightGray',
          '#1d90e6': 'buttonActive',
          '#4db3ff': 'buttonHover',
          '#dfe6ec': 'tableBorder',
          '#d2ecff': 'datepickerInRange',
          '#afddff': 'datepickerInRangeHover',
          '#1c8de0': 'selectOptionSelected',
          '#edf7ff': 'lightBackground'
        };
        Object.keys(colorMap).forEach(key => {
          const value = colorMap[key];
          data = data.replace(new RegExp(key, 'ig'), value);
        });
        return data;
      },

      getFile(url, isBlob = false) {
        return new Promise((resolve, reject) => {
          const client = new XMLHttpRequest();
          client.responseType = isBlob ? 'blob' : '';
          client.onreadystatechange = () => {
            if (client.readyState !== 4) {
              return;
            }
            if (client.status === 200) {
              const urlArr = client.responseURL.split('/');
              resolve({
                data: client.response,
                url: urlArr[urlArr.length - 1]
              });
            } else {
              reject(new Error(client.statusText));
            }
          };
          client.open('GET', url);
          client.send();
        });
      },

      getIndexStyle() {
        this.getFile('//unpkg.com/element-ui/lib/theme-default/index.css')
          .then(({ data }) => {
            this.originalStyle = this.getStyleTemplate(data);
          });
      },

      getSeparatedStyles() {
        this.getFile('//unpkg.com/element-ui/lib/theme-default')
          .then(({ data }) => {
            return data.match(/href="[\w-]+\.css"/g).map(str => str.split('"')[1]);
          })
          .then(styleFiles => {
            return Promise.all(styleFiles.map(file => {
              return this.getFile(`//unpkg.com/element-ui/lib/theme-default/${ file }`);
            }));
          })
          .then(files => {
            this.styleFiles = files.map(file => {
              return {
                name: file.url,
                data: this.getStyleTemplate(file.data)
              };
            });
          });
      },

      getFontFiles() {
        Promise.all(this.fontFiles.map(font => {
          return this.getFile(`//unpkg.com/element-ui/lib/theme-default/fonts/${ font }`, true);
        }))
          .then(fonts => {
            this.fonts = fonts;
          });
      }
    },

    created() {
      this.getIndexStyle();
      this.getSeparatedStyles();
      this.getFontFiles();
    },

    mounted() {
      this.$nextTick(_ => {
        this.originalStylesheetCount = document.styleSheets.length;
      });
    }
  };
</script>
