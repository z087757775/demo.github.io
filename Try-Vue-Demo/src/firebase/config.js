import { initializeApp } from 'firebase/app'
import { getAuth , fetchSignInMethodsForEmail } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyAW8zjoEKPfhBy5cvhQbwLJwLrvlBsYFVg",
  authDomain: "try-vue3-demo.firebaseapp.com",
  databaseURL: "https://try-vue3-demo-default-rtdb.firebaseio.com",
  projectId: "try-vue3-demo",
  storageBucket: "try-vue3-demo.appspot.com",
  messagingSenderId: "605619263536",
  appId: "1:605619263536:web:a418bb8d991fe3de22b5f5",
  measurementId: "G-RKTSBMSEGB"
};

  // 傳入 email 參數，檢查該用戶是否已經被註冊
const checkIfUserIsRegistered = async (email) => {
  const auth = getAuth();
  try {
    //使用 fetchSignInMethodsForEmail 方法來檢查用戶是否已被註冊
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    
    // 如果 signInMethods 長度大於 0，說明用戶已被註冊
    return signInMethods.length > 0;
  } catch (error) {
    console.error('檢查用戶註冊狀態時：', error);
    throw error;
  }
}

  const firebaseApp = initializeApp(firebaseConfig);
// 使用 getAuth 方法來獲取 auth 實例
const auth = getAuth(firebaseApp);
//將 auth 實例和 checkIfUserIsRegistered 方法導出
export { auth , checkIfUserIsRegistered };