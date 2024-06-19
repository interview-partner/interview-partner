import React, { useRef, useEffect, useState, useCallback } from 'react';
import send_Icon from '../../assets/icons/send_Icon.png';
import article_Icon from '../../assets/icons/article_Icon.png';
import userImageTest1 from '../../assets/images/userImage/userImage.png';
import chevron_right_Icon from '../../assets/icons/chevron_right_Icon.png';
import rate_review_Icon from '../../assets/icons/rate_review_Icon.png';
import ResumeViewer from './ResumeViewer';
import {
  ChatContainer, ChatCloseButton, Input, SendButton, UserList, User,
  Avatar, UserName, UserOptionButton, ChatBox, MessageContainer, InputContainer,
  MessageList, MessageContent, UserButtonContainer, Nickname, MessageWrapper
} from './chatstyle';
import { handleSendFeedback } from '../../services/feedbackService';
import FeedbackForm from './FeedbackForm';

/**
 * 채팅 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.isOpen - 채팅창 열림 여부
 * @param {Function} props.handleClose - 채팅창 닫기 함수
 * @param {Object} props.session - 세션 객체
 * @param {Array} props.messages - 메시지 배열
 * @param {Function} props.setMessages - 메시지 설정 함수
 */
const Chat = ({ isOpen, handleClose, session, messages, setMessages }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentView, setCurrentView] = useState('chat'); // State to manage current view
  const [selectedUserResume, setSelectedUserResume] = useState(null); // State to manage selected user resume
  const [selectedUserFeedback, setSelectedUserFeedback] = useState(null); // State to manage selected user feedback
  const messageListRef = useRef(null);
  const messageIds = useRef(new Set()); // 이미 처리된 메시지 ID를 저장하는 Set
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [activeUserId, setActiveUserId] = useState(null); // 사용자(참여자)ID 관리용, roomParticipantId 예: 버튼 클릭시 활성화된 사용자 이력서 제공
  const [feedbackContent, setFeedbackContent] = useState(''); // 피드백 내용 상태
  const [users, setUsers] = useState([]);

  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  /**
   * 사용자 목록 업데이트 함수
   */
  const updateUsers = useCallback(() => {
    if (session) {
      const userList = [
        { id: session.connection.connectionId, data: session.connection.data },
        ...Array.from(session.remoteConnections.values()).map((conn) => ({
          id: conn.connectionId,
          data: conn.data,
        }))
      ];
      setUsers(userList);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      session.on('connectionCreated', (event) => {
        updateUsers();
      });
      session.on('connectionDestroyed', (event) => {
        updateUsers();
      });

      updateUsers(); // 초기 사용자 목록 설정
    }
  }, [session, updateUsers]);

  useEffect(() => {
    if (session) {
      /**
       * 채팅 신호를 처리하는 함수
       * 
       * @param {Object} event - 신호 이벤트 객체
       */
      const handleSignalChat = (event) => {
        const messageData = JSON.parse(event.data);
        if (!messageIds.current.has(messageData.id)) {
          messageIds.current.add(messageData.id);
        }
      };
      session.on('signal:chat', handleSignalChat);

      return () => {
        session.off('signal:chat', handleSignalChat);
      };
    }
  }, [session, setMessages]);

  /**
   * 메시지를 전송하는 함수
   */
  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
      const sessionData = JSON.parse(session.connection.data); // 세션 데이터 파싱
      // const myUserName = `${sessionData.nickname} (${session.connection.connectionId})`; // 채팅창에서 사용자 이름을 닉네임 + 고유 ID로 설정
      const myUserName = `${sessionData.nickname}`; //채팅창에서 사용자 이름을 닉네임으로 설정
      const roomParticipantId = sessionData.roomParticipantId; // roomParticipantId 추가

      const messageData = {
        nickname: myUserName,
        content: inputValue,
        roomParticipantId: roomParticipantId, // roomParticipantId 추가
      };

      // 세션을 통해 메시지 전송
      session.signal({
        data: JSON.stringify(messageData),
        to: [],
        type: 'chat',
      });

      setInputValue('');
    }

  }, [inputValue, messages, session]);

  /**
   * 사용자의 이력서 버튼 클릭 처리 함수
   * 
   * @param {Object} selectedUserInfo - 선택된 사용자 정보
   */
  const handleUserResumeClick = (selectedUserInfo) => {
    const { roomParticipantId, resumeUrl } = selectedUserInfo;
    if (currentView === 'resume' && activeUserId === roomParticipantId) {
      setCurrentView('chat');
      setSelectedUserResume(null);
      setActiveUserId(null);
    } else {
      setCurrentView('resume');
      setSelectedUserResume(resumeUrl);
      setActiveUserId(roomParticipantId);
    }
  };

  /**
   * 사용자의 피드백 버튼 클릭 처리 함수
   * 
   * @param {Object} selectedUserInfo - 선택된 사용자 정보
   */
  const handleUserFeedbackClick = (selectedUserInfo) => {
    const { roomParticipantId } = selectedUserInfo;
    if (currentView === 'feedback' && activeUserId === roomParticipantId) {
      setTimeout(() => {
        setIsFeedbackVisible(false);
      }, 500); // 애니메이션 지속 시간과 동일하게 설정
    } else {
      setSelectedUserFeedback(selectedUserInfo);
      setCurrentView('feedback');
      setActiveUserId(roomParticipantId);
      setIsFeedbackVisible(true);
    }
  };

  /**
   * 피드백을 전송하는 함수
   */
  const onSendFeedback = async () => {
    try {
      // session.connection.data를 '%/%'로 분할
      let myUserInfo = session.connection.data.split('%/%');
      // 각 분할된 부분을 JSON 객체로 파싱
      myUserInfo = myUserInfo.map(info => JSON.parse(info));
      // roomParticipantId 추출
      let myParticipantId = parseInt(myUserInfo[0].roomParticipantId, 10);
      let selectedUserParticipantId = parseInt(selectedUserFeedback.roomParticipantId, 10);

      const success = await handleSendFeedback(myParticipantId, selectedUserParticipantId, feedbackContent);
      if (success) {
        setFeedbackContent('');
      }
    } catch (error) {
      console.error('Error in onSendFeedback:', error);
    }
  };

  useEffect(() => {
    if (!isFeedbackVisible) {
      const timer = setTimeout(() => setCurrentView('chat'), 230); // 애니메이션 지속 시간과 동일하게 설정
      return () => clearTimeout(timer);
    }
  }, [isFeedbackVisible])

  useEffect(() => {
    if (currentView === 'resume' && selectedUserResume) {
      console.log("이력서가 로드되었습니다:", selectedUserResume);
    }
  }, [currentView, selectedUserResume]);


  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      if (isAutoScroll) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }, [messages, isAutoScroll]);

  /**
   * 스크롤 이벤트 처리 함수
   */
  const handleScroll = () => {
    const messageList = messageListRef.current;
    if (messageList) {
      const isScrolledToBottom = messageList.scrollHeight - messageList.clientHeight <= messageList.scrollTop + 1;
      setIsAutoScroll(isScrolledToBottom);
    }
  };

  return (
    <ChatContainer isOpen={isOpen} >
      <ChatCloseButton onClick={handleClose}>
        <img src={chevron_right_Icon} alt="Close Chat" />
      </ChatCloseButton>
      <UserList>
        {session && users.length > 0 && users.map(user => {
          const isMe = user.id === session.connection.connectionId; // 현재 사용자 확인, 본인이 본인에게 피드백을 할 필요가 없으므로 본인에 해당하는 피드백 버튼은 제외 
          let parsedData = [{ nickname: "Unknown User" }];
          try {
            const parts = user.data.split('%/%');
            parsedData = parts.map(part => JSON.parse(part));
          } catch (error) {
            console.error("JSON parsing error for user.data:", user.data, error);
          }

          const selectedUserInfo = parsedData[0];
          return (
            <User key={user.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar src={userImageTest1} alt="User Avatar" />
                <UserName>{selectedUserInfo.nickname || "Unknown User"}</UserName>
              </div>
              <UserButtonContainer>
                {!isMe && (
                  <UserOptionButton
                    onClick={() => handleUserFeedbackClick(selectedUserInfo)}
                    isActive={currentView === 'feedback' && activeUserId === selectedUserInfo.roomParticipantId}
                  >
                    <img src={rate_review_Icon} alt="User Feedback" />
                  </UserOptionButton>
                )}
                <UserOptionButton
                  onClick={() => handleUserResumeClick(selectedUserInfo)}
                  isActive={currentView === 'resume' && activeUserId === selectedUserInfo.roomParticipantId}
                >
                  <img src={article_Icon} alt="User Resume" />
                </UserOptionButton>
              </UserButtonContainer>
            </User>
          );
        })}
      </UserList>

      <ChatBox>
        <MessageContainer>
          {(() => {
            switch (currentView) {
              case 'chat':
                return (
                  <MessageList ref={messageListRef} onScroll={handleScroll}>
                    {messages.map((message, index) => {
                      // 세션과 연결 객체가 유효한지 확인
                      const isCurrentUser = session && session.connection &&
                        session.connection.data &&
                        JSON.parse(session.connection.data).roomParticipantId === message.roomParticipantId;

                      return (
                        <MessageWrapper key={index} isUser={isCurrentUser}>
                          {!isCurrentUser && <Nickname>{message.nickname}</Nickname>}
                          <MessageContent isUser={isCurrentUser}>{message.content}</MessageContent>
                        </MessageWrapper>
                      );
                    })}
                  </MessageList>
                );
              case 'resume':
                return <ResumeViewer resumeUrl={selectedUserResume} />;
              case 'feedback':
                return (
                  <FeedbackForm
                    nickname={selectedUserFeedback.nickname}
                    feedbackContent={feedbackContent}
                    setFeedbackContent={setFeedbackContent}
                    onSendFeedback={onSendFeedback}
                    isVisible={isFeedbackVisible}
                  />
                );

              default:
                return null;
            }
          })()}
        </MessageContainer>
        {
          currentView === 'chat' && (
            <InputContainer>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <SendButton onClick={handleSendMessage}>
                <img src={send_Icon} alt="Send" />
              </SendButton>
            </InputContainer>
          )
        }
      </ChatBox>
    </ChatContainer >
  );
};

export default Chat;