import { config } from "../config";

//이메일 유효성 검사 
export function emailChangeHandler(setEmail, setError) {
    return (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!newEmail) {
            setError(prev => ({ ...prev, email: "Email is required" }));
        } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setError(prev => ({ ...prev, email: "Invalid email format" }));
        } else {
            setError(prev => ({ ...prev, email: "" }));
        }
    };
}

//비밀번호 유효성 검사
export function passwordChangeHandler(setPassword, setError) {
    return (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!newPassword) {
            setError(prev => ({ ...prev, password: "Password is required" }));
        } else if (newPassword.length < 8 || newPassword.length > 12) {
            setError(prev => ({ ...prev, password: "Password must be between 8 and 12 characters" }));
        } else {
            setError(prev => ({ ...prev, password: "" }));
        }
    };
}

//닉네임 유효성 검사
export function nicknameChangeHandler(setNickname, setError) {
    return async (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        if (!newNickname) {
            setError(prev => ({ ...prev, nickname: "Nickname is required" }));
        } else if (newNickname.length < 2 || newNickname.length > 10) {
            setError(prev => ({ ...prev, nickname: "Nickname must be between 2 and 10 characters" }));
        } else {
            try {
                const response = await fetch(`${config.apiUrl}/api/v1/members/check/nickname/${newNickname}`);
                const responseData = await response.json();
                const nicknameData = responseData.data;

                if (nicknameData && nicknameData.nicknameAvailable === true) {
                    //사용가능한 닉네임인 경우
                    setError(prev => ({ ...prev, nickname: "" }));
                } else if (nicknameData && nicknameData.nicknameAvailable === false) {
                    //사용 불가능한 닉네임인 경우 -> 중복된 닉네임
                    setError(() => ({ nickname: "Nickname already exists" }));
                }
            } catch (error) {
                console.error("Error checking nickname availability:", error);
            }
        }
    };
}
