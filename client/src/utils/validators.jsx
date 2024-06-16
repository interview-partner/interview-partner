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

// 회원가입 시 비밀번호와 확인 비밀번호가 일치하는지 확인
export function validatePassword(password, confirmPassword, setError) {
    if (confirmPassword && password !== confirmPassword) {
        setError(prev => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }));
    } else {
        setError(prev => ({ ...prev, confirmPassword: "" }));
    }
}

// 회원가입 시 닉네임과 확인 닉네임이 일치하는지 확인
export function validateNickname(nickname, confirmNickname, setError) {
    if (nickname !== confirmNickname) {
        setError(prev => ({ ...prev, confirmNickname: "닉네임이 일치하지 않습니다." }));
    } else {
        setError(prev => ({ ...prev, confirmNickname: "" }));
    }
}

/**
 *  회원가입 시 입력 필드 유효성 검사
 */
export const validateFields = (fields) => {
    const newError = {};
    const { email, password, confirmPassword, nickname, confirmNickname } = fields;

    if (!email) {
        newError.email = "이메일을 입력해주세요.";
    }
    if (!password) {
        newError.password = "비밀번호를 입력해주세요.";
    }
    if (!confirmPassword) {
        newError.confirmPassword = "비밀번호 확인을 입력해주세요.";
    }
    if (!nickname) {
        newError.nickname = "닉네임을 입력해주세요.";
    }
    if (!confirmNickname) {
        newError.confirmNickname = "닉네임 확인을 입력해주세요.";
    }

    return newError;
};

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

//방 생성 모달 태그 이름 길이 유효성 검사
export const validateTagLength = (tag) => {
    if (tag.length > 15) {
        return '태그 이름은 15자 이하이어야 합니다.';
    }
    return null;
};

//방 생성 모달 이름 입력 유효성 검사
export const validateTitle = (title) => {
    if (!title) {
        return '방 이름을 입력해주세요.';
    }
    if (title.length < 0 || title.length > 50) {
        return '방 이름을 50자 이내로 입력해주세요.';
    }
    return '';
};

//방 생성 모달 한줄 설명 입력 유효성 검사
export const validateDescription = (description) => {
    if (description === '') {
        return '한줄 설명을 입력해주세요.';
    }
    return '';
};

//방 생성 모달 참가자 수 입력 유효성 검사
export const validateMaxParticipants = (maxParticipants) => {
    if (maxParticipants < 2 || maxParticipants > 4) {
        return '최대 참가자 수는 2명에서 4명 사이여야 합니다.';
    }
    return '';
};

//방 생성 모달 태그 숫자 유효성 검사 
export const validateTagNumber = (tags) => {
    if (tags.length === 0) {
        return '적어도 하나의 태그를 추가해야 합니다.'
    }
    if (tags.length > 3) {
        return '태그는 최대 3개까지 추가할 수 있습니다.';
    }
    return '';
};