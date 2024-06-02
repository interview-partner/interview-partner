import api from './axiosConfig';

export const handleSendFeedback = async (myParticipantId, selectedUserParticipantId, feedbackContent) => {
    try {
        const response = await api.post('/feedbacks', {
            senderParticipantId: myParticipantId,
            receiverParticipantId: selectedUserParticipantId,
            content: feedbackContent,
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        console.log('피드백 전송 성공:', response.data);
        alert('피드백이 성공적으로 전송되었습니다.');
        return true;
    } catch (error) {
        let errorMessage = '피드백 전송에 실패했습니다.';

        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = '유효하지 않은 형식입니다.';
                    break;
                case 409:
                    errorMessage = '동일한 참가자에게 이미 피드백을 보냈습니다. 피드백은 한번만 보낼 수 있습니다.';
                    break;
                default:
                    errorMessage = '알 수 없는 오류가 발생했습니다.';
                    break;
            }
        }

        console.error('피드백 전송 실패:', error);
        alert(errorMessage);
        return false;
    }
};
