<template>
  <div class="wrapper">
    <header
      :style="{ 'background-color': `#${ primaryColor }` }">
      <img
        src="./assets/element-logo.svg"
        alt="element-logo"
        class="header-logo">
      <ul class="header-operations">
        <li @click="showThemeDialog">切换主题色</li>
        <li>帮助</li>
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
          <el-menu-item index="1">页面一</el-menu-item>
          <el-menu-item index="2">页面二</el-menu-item>
          <el-menu-item index="3">页面三</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" class="content">
        <router-view></router-view>
      </el-col>
    </el-row>
    <el-dialog v-model="themeDialogVisible" title="切换主题色" size="tiny">
      <el-form
        :model="colors"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="70px">
        <el-form-item label="主题色" prop="primary">
          <el-input v-model="colors.primary" class="color-input"></el-input>
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="submitForm">切换</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
  html, body {
    height: 100%;
  }
  
  body {
    font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  }
  
  a {
    text-decoration: none;
  }
  
  header {
    height: 80px;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    @utils-vertical-center;
    padding: 0 20px;
    z-index: 1;
  }
  
  .container, .wrapper {
    height: 100%;
  }
  
  .wrapper {
    position: relative;
  }
  
  .container {
    padding-top: 80px;
  }
  
  .menu {
    height: 100%;
  }
  
  .content {
    padding: 25px;
  }
  
  .header-logo {
    display: inline-block;
    vertical-align: middle;
  }
  
  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 100px;
    height: 100%;
    @utils-vertical-center;
    li {
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      padding: 0 10px;
      margin: 0 10px;
      line-height: 80px;
      cursor: pointer;
      &:last-child {
        cursor: default;
      }
    }
    span {
      opacity: 0.7;
    }
    .header-lang {
      cursor: pointer;
      @when active {
        opacity: 1;
      }
    }
  }
  
  .color-input::before {
    content: "#";
    position: absolute;
    left: 5px;
  }
  
  .color-input input {
    padding-left: 15px;
  }
  
  .color-buttons {
    float: right;
  }
</style>

<script>
  import generateColors from './utils/color';
  import menu from './element-styles/menu';
  import button from './element-styles/button';
  import dialog from './element-styles/dialog';
  import input from './element-styles/input';

  export default {
    name: 'app',

    data() {
      const colorValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('主题色不能为空'));
        } else if (!/^[\dabcdef]{6}$/i.test(value)) {
          return callback(new Error('请输入 hex 格式的主题色'));
        } else {
          callback();
        }
      };
      return {
        colors: {
          primary: '20a0ff'
        },
        rules: {
          primary: [
            { validator: colorValidator, trigger: 'blur' }
          ]
        },
        primaryColor: '20a0ff',
        themeDialogVisible: false
      };
    },

    computed: {
      lang() {
        return this.$route.path;
      }
    },

    methods: {
      switchLang(lang) {
        this.$router.push(lang);
      },

      showThemeDialog() {
        this.themeDialogVisible = true;
      },

      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.themeDialogVisible = false;
            this.primaryColor = this.colors.primary;
            this.colors.primary = `#${ this.colors.primary }`;
            this.colors = Object.assign({}, this.colors, generateColors(this.colors.primary));

            let newCSS = '';
            newCSS += menu + button + dialog + input;
            Object.keys(this.colors).forEach(key => {
              console.log(key, this.colors[key]);
              newCSS = newCSS.replace(new RegExp(' ' + key, 'g'), ' ' + this.colors[key]);
            });

            const style = document.createElement('style');
            style.innerText = newCSS;
            document.head.appendChild(style);
  
            this.colors.primary = this.colors.primary.replace(/#/, '');
          } else {
            return false;
          }
        });
      },

      resetForm() {
        this.$refs.form.resetFields();
      }
    }
  };
</script>
