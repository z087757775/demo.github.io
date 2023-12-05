<script>
import { useStore } from 'vuex'
import { ref, watch } from 'vue'
import { elementPlusComponents, elementPlusIcons } from '@/store/elementPlusComponents'
import { ElMessage } from 'element-plus'
import { checkIfUserIsRegistered } from '@/firebase/config.js'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    // 設置表單切換狀態
    const isRegister = ref(false)
    // 登入表單的 loading 狀態
    const loading = ref(false)

    // 創建登入表單對象
    const loginForm = ref({
      passwordVisible: false,
      email: '',
      password: '',
      emailError: '', // 使用不同的錯誤信息字段
      passwordError: '' // 使用不同的錯誤信息字段
    })

    // 創建註冊表單對象
    const registerForm = ref({
      passwordVisible: false, // 控制密碼可見性的狀態
      doublePasswordVisible: false, // 控制再次輸入密碼可見性的狀態
      email: '',
      password: '',
      doublePassword: '',
      emailError: '',
      passwordError: '',
      doublePasswordError: ''
    })

    // 監聽 isRegister 變化
    watch(isRegister, (newValue) => {
      if (newValue) {
        // 當 isRegister 變為 true 時，清空註冊表單數據和錯誤信息
        registerForm.value.email = ''
        registerForm.value.password = ''
        registerForm.value.emailError = ''
        registerForm.value.passwordError = ''
        registerForm.value.doublePassword = ''
      } else {
        // 當 isRegister 變為 false 時，清空登入表單數據和錯誤信息
        loginForm.value.email = ''
        loginForm.value.password = ''
        loginForm.value.emailError = ''
        loginForm.value.passwordError = ''
      }
    })

    // 驗證字段的函數
    const validateField = (field, formName) => {
      const form = formName === 'registerForm' ? registerForm.value : loginForm.value
      // 清除錯誤信息
      form[`${field}Error`] = ''

      if (!form[field]) {
        form[`${field}Error`] = field === 'email' ? '請輸入信箱' : '請輸入密碼'
        return false
      } else if (field === 'password') {
        // 密碼長度檢查
        if (form[field].length < 6) {
          form[`${field}Error`] = '密碼必須至少6個字符長'
          return false
        }

        // 密碼強度檢查（包含）：大小寫字母、數字
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/
        if (!passwordRegex.test(form[field])) {
          form[`${field}Error`] = '密碼必須包含大小寫字母和數字'
          return false
        }

        // 阻止常見密碼
        const commonPasswords = ['password', '123456', 'qwerty']
        if (commonPasswords.includes(form[field])) {
          form[`${field}Error`] = '請選擇更強的密碼'
          return false
        }
      } else if (field === 'email' && !isValidEmail(form[field])) {
        form[`${field}Error`] = '請輸入正確的email格式(xxx@yahoo.com.tw)'
        return false
      } else if (field === 'doublePassword' && form[field] !== form['password']) {
        form[`${field}Error`] = '密碼不一致'
        return false
      }

      return true
    }

    // 阻擋輸入國字
    const restrictChinese = (form, inputField) => {
      const pattern = /[\u4e00-\u9fa5]/
      if (pattern.test(form[inputField])) {
        // 如果包含中文字符，去除它们
        form[inputField] = form[inputField].replace(pattern, '')
      }
    }

    // 監聽表單字段的變化
    watch(
      () => registerForm.value.email,
      () => {
        restrictChinese(registerForm.value, 'email')
      }
    )

    watch(
      () => registerForm.value.password,
      () => {
        restrictChinese(registerForm.value, 'password')
      }
    )

    watch(
      () => loginForm.value.email,
      () => {
        restrictChinese(loginForm.value, 'email')
      }
    )

    // 獲取字段錯誤信息的函數
    const getFieldError = (field, formName) => {
      const form = formName === 'registerForm' ? registerForm.value : loginForm.value
      // 根據表單名稱來獲取錯誤信息字段名稱
      const errorField = `${field}Error${formName === 'registerForm' ? 'Register' : ''}`
      return form[errorField]
    }
    // 驗證信箱格式的函數
    const isValidEmail = (email) => {
      return /^\S+@\S+\.\S+$/.test(email)
    }

    const login = async () => {
      loading.value = true
      // 先驗證表單字段
      const isEmailValid = validateField('email', 'loginForm')
      const isPasswordValid = validateField('password', 'loginForm')

      if (isEmailValid && isPasswordValid) {
        try {
          // 調用 login 函數
          await store.dispatch('login', loginForm.value)
          loading.value = false
        } catch (error) {
          ElMessage.error('登入失敗：' + error.message)
          loading.value = false
          router.push('/login')
        }
      } else {
        // 如果字段驗證失敗，彈出錯誤消息
        ElMessage.error('請輸入正確的信箱和密碼')
        loading.value = false
      }
    }

    // 驗證密碼是否一致
    const validateAndRegister = () => {
      // 點擊按鈕時，先驗證表單字段，然後再執行註冊操作，否則彈出錯誤消息
      const emailValid = validateField('email', 'registerForm')
      const passwordValid = validateField('password', 'registerForm')
      const doublePasswordValid = validateField('doublePassword', 'registerForm')

      if (emailValid && passwordValid && doublePasswordValid) {
        // 驗證密碼是否一致
        if (registerForm.value.password !== registerForm.value.doublePassword) {
          registerForm.value.doublePasswordError = '密碼不一致'
        } else {
          // 驗證成功，執行註冊操作
          register()
        }
      } else {
        // 當字段驗證失敗時，彈出錯誤消息
        ElMessage.error('請輸入正確的信箱和密碼')
      }
    }

    // 註冊函數
    const register = async () => {
      if (validateField('email', 'registerForm') && validateField('password', 'registerForm')) {
        const email = registerForm.value.email

        // 檢查用戶是否已經被註冊
        const isUserRegistered = await checkIfUserIsRegistered(email)

        if (isUserRegistered) {
          // 用戶已註冊，彈出錯誤消息
          ElMessage.error('信箱已被註冊')
          loading.value = false
        } else {
          loading.value = true
          try {
            // 用戶未註冊，執行註冊操作
            await store.dispatch('register', registerForm.value)
            isRegister.value = false
          } catch (error) {
            console.log(error)
          }
        }
      }
    }

    return {
      login,
      register,
      validateField,
      getFieldError,
      validateAndRegister,
      restrictChinese,
      loginForm,
      registerForm,
      isRegister,
      ...elementPlusComponents,
      ...elementPlusIcons,
      checkIfUserIsRegistered
    }
  }
}
</script>

<template>
  <div>
    <el-row class="login-page">
      <el-col :span="12" class="bg"></el-col>
      <el-col :span="6" :offset="3" class="form">
        <!-- 註冊模塊 -->
        <transition name="fade2" mode="out-in">
          <el-form @submit.prevent="register" size="large" autocomplete="off" v-if="isRegister">
            <el-form-item>
              <h1>註冊</h1>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                :prefix-icon="User"
                v-model.trim="registerForm.email"
                placeholder="請輸入信箱"
                @blur="validateField('email', 'registerForm')"
                @input="restrictChinese('email')"
                @keydown.enter="validateAndRegister"
              ></el-input>
              <p v-if="registerForm.emailError" class="error">{{ registerForm.emailError }}</p>
            </el-form-item>
            <el-form-item prop="password" class="input-container">
              <div class="input-wrapper">
                <el-input
                  v-model.trim="registerForm.password"
                  placeholder="請輸入密碼"
                  :prefix-icon="Lock"
                  @blur="validateField('password', 'registerForm')"
                  :type="registerForm.passwordVisible ? 'text' : 'password'"
                  @input="restrictChinese('password')"
                  @keydown.enter="validateAndRegister"
                >
                </el-input>
                <i
                  @click="registerForm.passwordVisible = !registerForm.passwordVisible"
                  :class="{
                    'input-with-icon': !registerForm.passwordVisible,
                    'input-with-icon2': registerForm.passwordVisible
                  }"
                ></i>
              </div>
              <p v-if="registerForm.passwordError" class="error">
                {{ registerForm.passwordError }}
              </p>
            </el-form-item>

            <el-form-item prop="doublePassword">
              <div class="input-wrapper">
                <el-input
                  :prefix-icon="CircleCheck"
                  v-model.trim="registerForm.doublePassword"
                  placeholder="請再次輸入密碼"
                  @blur="validateField('doublePassword', 'registerForm')"
                  :type="registerForm.doublePasswordVisible ? 'text' : 'password'"
                  @input="restrictChinese('password')"
                  @keydown.enter="validateAndRegister"
                >
                </el-input>
                <i
                  @click="registerForm.doublePasswordVisible = !registerForm.doublePasswordVisible"
                  :class="{
                    'input-with-icon': !registerForm.doublePasswordVisible,
                    'input-with-icon2': registerForm.doublePasswordVisible
                  }"
                ></i>
              </div>
              <p v-if="registerForm.doublePasswordError" class="error">
                {{ registerForm.doublePasswordError }}
              </p>
            </el-form-item>

            <el-form-item>
              <el-button
                class="button"
                type="primary"
                auto-insert-space
                @click="validateAndRegister"
              >
                註冊
              </el-button>
            </el-form-item>
            <el-form-item class="flex">
              <el-link type="info" :underline="false" @click="isRegister = false">
                ⬅️已註冊，去登入
              </el-link>
            </el-form-item>
          </el-form>

          <!-- 登入模塊:rules="rules" -->
          <el-form @submit.prevent="login" size="large" autocomplete="off" v-else>
            <el-form-item>
              <h1>登入</h1>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                :prefix-icon="User"
                placeholder="請輸入信箱"
                @blur="validateField('email', 'loginForm')"
                @input="restrictChinese('email')"
                @keydown.enter="login"
              >
              </el-input>
              <p v-if="loginForm.emailError" class="error">{{ loginForm.emailError }}</p>
            </el-form-item>
            <el-form-item prop="password" class="input-container">
              <div class="input-wrapper">
                <el-input
                  v-model.trim="loginForm.password"
                  placeholder="請輸入密碼"
                  :prefix-icon="Lock"
                  @blur="validateField('password', 'loginForm')"
                  :type="loginForm.passwordVisible ? 'text' : 'password'"
                  @input="restrictChinese('password')"
                  @keydown.enter="login"
                >
                </el-input>
                <i
                  @click="loginForm.passwordVisible = !loginForm.passwordVisible"
                  :class="{
                    'input-with-icon': !loginForm.passwordVisible,
                    'input-with-icon2': loginForm.passwordVisible
                  }"
                ></i>
              </div>
              <p v-if="loginForm.passwordError" class="error">{{ loginForm.passwordError }}</p>
            </el-form-item>

            <el-form-item>
              <el-button @click="login" class="button" type="primary" auto-insert-space>
                登入
              </el-button>
            </el-form-item>
            <el-form-item class="flex">
              <el-link type="info" :underline="false" @click="isRegister = true">
                未申請，去註冊➡️
              </el-link>
            </el-form-item>
          </el-form>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
}

.bg {
  background:
    url('@/photo/img5.jpg') no-repeat 60% center / 240px auto,
    url('@/photo/img5.jpg') no-repeat center / cover;
  border-radius: 0 20px 20px 0;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}

.button {
  width: 100%;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.fade2-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade2-enter-active {
  transition: all 0.3s ease-out;
}

.fade2-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade2-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade2-leave-active {
  transition: all 0.3s ease-out;
}

.fade2-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.error {
  color: red;
  margin: 0 !important;
}

.input-container {
  position: relative;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-with-icon {
  content: url(https://api.iconify.design/ep/view.svg);
  position: absolute;
  top: 50%;
  right: 15px;
  cursor: pointer;
  transform: translateY(-50%);
}

.input-with-icon2 {
  content: url(https://api.iconify.design/ep/hide.svg);
  position: absolute;
  top: 50%;
  right: 15px;
  cursor: pointer;
  transform: translateY(-50%);
}

.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
