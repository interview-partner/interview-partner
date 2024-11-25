// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import api from "./axiosConfig";
// import { config } from "../config";

// /**
//  * Google 로그인 함수
//  * 
//  * @param {object} auth - Firebase 인증 객체
//  * @param {function} setLoginError - 로그인 오류 상태를 설정하는 함수
//  * @param {function} setShowNotification - 알림 상태를 설정하는 함수
//  */
// const googleLogin = (auth, setLoginError, setShowNotification) => {
//     const provider = new GoogleAuthProvider();

//     /**
//      * Firebase 팝업을 통한 Google 로그인 시도
//      */
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             result.user.getIdToken().then((idToken) => {

//                 /**
//                  * Firebase ID 토큰을 백엔드로 전송하여 로그인 처리
//                  */
//                 api.post(`${config.apiUrl}/api/v1/auth/login/firebase/google`, {
//                     idToken: idToken
//                 }, {
//                     withCredentials: true
//                 })
//                     .then(response => {
//                         if (response.status === 200) {
//                             console.log('로그인 성공:', response.data);
//                             const accessToken = response.headers['authorization'].replace('Bearer ', '');
//                             console.log('구글로그인 액세스토큰:', accessToken);
//                             localStorage.setItem('accessToken', accessToken);
//                             window.location.href = '/'
//                         }
//                     })
//                     .catch(error => {
//                         /**
//                          * 백엔드 응답 오류 처리
//                          */
//                         if (error.response && error.response.status === 400) {
//                             setLoginError("잘못된 요청입니다. 유효한 Firebase 토큰이 필요합니다.");
//                         } else if (error.response && error.response.status === 409) {
//                             setLoginError("동일한 소셜 계정으로 가입된 회원이 이미 존재합니다.");
//                         } else {
//                             setLoginError("로그인 중 오류가 발생했습니다.");
//                         }
//                         setShowNotification(true);
//                         console.error('Firebase login error:', error);
//                         window.location.href = '/login'
//                     });
//             });
//         })
//         .catch((error) => {
//             /**
//              * Firebase 팝업 로그인 오류 처리
//              */
//             setLoginError("구글 로그인 중 오류가 발생했습니다.");
//             setShowNotification(true);
//             console.error('Firebase login error:', error);
//         });
// };

// export default googleLogin;
