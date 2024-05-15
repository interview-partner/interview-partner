import { config } from "../config";

//회원가입 이메일 유효성 검사 
export function signupEmailChangeHandler(setEmail, setError) {
    return (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!newEmail) {
            setError(prev => ({ ...prev, email: "이메일을 입력해주세요." }));
        } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setError(prev => ({ ...prev, email: "이메일 형식을 확인해주세요." }));
        } else {
            setError(prev => ({ ...prev, email: "" }));
        }
    };
}

//회원가입 비밀번호 유효성 검사
export function signupPasswordChangeHandler(setPassword, setError) {
    return (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!newPassword) {
            setError(prev => ({ ...prev, password: "비밀번호를 입력해주세요." }));
        } else if (newPassword.length < 8 || newPassword.length > 12) {
            setError(prev => ({ ...prev, password: "비밀번호는 8자에서 12자 사이여야 합니다." }));
        } else {
            setError(prev => ({ ...prev, password: "" }));
        }
    };
}

//회원가입 닉네임 유효성 검사
export function signupNicknameChangeHandler(setNickname, setError) {
    return async (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);

        if (!newNickname) {
            setError(prev => ({ ...prev, nickname: "닉네임을 입력해주세요" }));
        } else if (newNickname.length < 2 || newNickname.length > 10) {
            setError(prev => ({ ...prev, nickname: "닉네임은 2자에서 10자 사이여야 합니다." }));
        } else {
            try {
                const response = await fetch(`${config.apiUrl}/api/v1/members/check/nickname/${newNickname}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const nicknameData = responseData.data;

                    if (nicknameData && nicknameData.nicknameAvailable === true) {
                        //사용가능한 닉네임인 경우
                        setError(prev => ({ ...prev, nickname: "" }));
                    } else if (nicknameData && nicknameData.nicknameAvailable === false) {
                        //사용 불가능한 닉네임인 경우 -> 중복된 닉네임
                        setError(() => ({ nickname: "이미 존재하는 닉네임입니다." }));
                    }
                } else if (response.status === 400) {
                    //유효하지 않은 형식의 요청인 경우
                    setError(() => ({ nickname: "유효하지 않은 닉네임 형식입니다" }));
                } else {
                    //다른 오류인 경우
                    setError(() => ({ nickname: "An unknown error occurred" }));
                }
            } catch (error) {
                console.error("Error checking nickname availability:", error);
                setError(() => ({ nickname: "Network error occurred while checking nickname" }));
            }
        }
    };
}

//로그인 이메일 유효성 검사
export function loginEmailChangeHandler(setEmail, setValidationErrors) {
    return (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!newEmail) {
            setValidationErrors(prev => ({ ...prev, email: "이메일을 입력해주세요." }));
        } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setValidationErrors(prev => ({ ...prev, email: "이메일 형식을 확인해주세요." }));
        } else {
            setValidationErrors(prev => ({ ...prev, email: "" }));
        }
    };
}

//로그일 비밀번호 유효성 검사
export function loginPasswordChangeHandler(setPassword, setValidationErrors) {
    return (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!newPassword) {
            setValidationErrors((prev) => ({ ...prev, password: "비밀번호를 입력해주세요." }));
        } else {
            setValidationErrors((prev) => ({ ...prev, password: "" }));
        }
    };
}
