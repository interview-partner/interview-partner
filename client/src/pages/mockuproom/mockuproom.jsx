import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserVideoComponent from '../../components/UserVideoComponent';
import { initializeSession } from '../../services/openviduService';
import voiceIcon from '../../assets/icons/voice_Icon.png';
import headphoneIcon from '../../assets/icons/headphone_Icon.png';
import callEndIcon from '../../assets/icons/call_end_Icon.png';
import Chat from './chat';
import { Container, VideoContainer, ButtonContainer, IconButton, IconImage, ToggleChatButton } from './mockuproomstyle';

const MAX_PARTICIPANTS = 4;

/**
 * Mockuproom 컴포넌트
 */
function Mockuproom() {
  // 입장 토큰
  const location = useLocation();
  const { token } = location.state || {};

  const navigate = useNavigate();
  const handleCloseChat = () => setIsOpen(false);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const OV = useRef(null);
  const hasJoined = useRef(false);
  const [isOpen, setIsOpen] = useState(false);  // 채팅창 열고 닫기
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true); //마이크 on/off 상태관리
  const [isMuted, setIsMuted] = useState(true); // 음소거 on/off 상태관리

  /**
   * 채팅창을 토글하는 함수
   */
  const toggleChat = () => {
    if (!isOpen) {
      setShouldRender(true);
    }
    setIsOpen(!isOpen);
  };

  /**
   * 메인 비디오 스트림을 설정하는 함수
   * 
   * @param {Object} stream - 스트림 객체
   */
  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  }, [mainStreamManager]);

  /**
   * 채팅창 닫기 애니메이션을 위한 타이머 설정
   */
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShouldRender(false), 300); // 채팅창 열기 애니메이션, 지속 시간과 동일하게 설정
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * 세션에 참여하는 함수
   */
  const joinSession = useCallback(async () => {

    if (hasJoined.current) {
      console.log('Already joined the session.');
      return;
    }

    const { OV: newOV, mySession } = initializeSession({
      addSubscriber: (subscriber) => setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]),
      deleteSubscriber: (streamManager) => setSubscribers((prevSubscribers) => {
        const index = prevSubscribers.indexOf(streamManager);
        if (index > -1) {
          const newSubscribers = [...prevSubscribers];
          newSubscribers.splice(index, 1);
          return newSubscribers;
        } else {
          return prevSubscribers;
        }
      }),
      addMessage: (message) => setMessages((prevMessages) => [...prevMessages, message]),
    });

    OV.current = newOV;

    try {
      await mySession.connect(token);
      const currentParticipants = mySession.remoteConnections.length + 1;

      if (currentParticipants > MAX_PARTICIPANTS) {
        alert('The room is full. Please try again later.');
        navigate('/');
        return;
      }

      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      mySession.publish(publisher);
      setPublisher(publisher);

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

      setMainStreamManager(publisher);

      setSession(mySession); // 세션 설정

      hasJoined.current = true;

    } catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
      if (error) {
        alert('Authentication error');
        await leaveSession(false);
        setTimeout(() => window.location.href = '/mockupcommunity', 500);
      }
    }
  }, [navigate]);

  /**
    * 마이크 상태 관리 함수
    * 
    */
  const toggleMicrophone = () => {
    if (publisher) {
      publisher.publishAudio(!isMicrophoneOn);
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  };

  /**
   * 음소거 상태 관리 함수
   */
  const toggleMute = () => {
    if (session) {
      subscribers.forEach(subscriber => {
        subscriber.subscribeToAudio(!isMuted);
      });
      setIsMuted(!isMuted);  // 로컬 상태 업데이트
    }
  }

  /**
   * 세션을 떠나는 함수
   * 
   * @param {boolean} isNavigate  - navigate 여부
   */
  const leaveSession = useCallback(async (isNavigate) => {

    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('popstate', handlePopState);

    if (session) {
      if (publisher && publisher.stream && publisher.stream.getMediaStream) {
        const mediaStream = publisher.stream.getMediaStream();
        if (mediaStream && mediaStream.getTracks) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
      }

      if (session.unpublish) {
        await session.unpublish(publisher);
      }
      await session.disconnect();
    }

    // 상태 초기화
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    hasJoined.current = false;

    if (isNavigate === true) {
      // 상태 업데이트가 반영된 후 navigate 실행
      setTimeout(() => navigate('/mockupcommunity'), 1000);
    }
  }, [session, publisher]);

  /**
   * 새로고침 이벤트를 처리하는 함수
   * 
   * @param {Event} event - 브라우저 이벤트 객체
   */
  const handleBeforeUnload = async (event) => {
    window.location.href = '/mockupcommunity';
    await leaveSession(false);
  };

  /**
   * 브라우저의 뒤로가기 이벤트를 처리하는 함수
   * 
   * @param {Event} event - 브라우저 이벤트 객체
   */
  const handlePopState = async (event) => {
    navigate('/mockupcommunity')
    await leaveSession(false);
    window.location.href = '/mockupcommunity';
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('popstate', handlePopState);

  useEffect(() => {
    joinSession();

    return () => {
      if (session) {
        session.disconnect();
      }
      OV.current = null;
      setSession(undefined);
      hasJoined.current = false;
    };
  }, []);

  return (
    <Container isOpen={isOpen}>
      <VideoContainer isOpen={isOpen}>
        {mainStreamManager && (
          <div onClick={() => handleMainVideoStream(mainStreamManager)}>
            <UserVideoComponent streamManager={mainStreamManager} />
          </div>
        )}
        {subscribers.map((sub, i) => (
          <div key={i} onClick={() => handleMainVideoStream(sub)}>
            <UserVideoComponent streamManager={sub} />
          </div>
        ))}
      </VideoContainer>
      <ButtonContainer>
        <IconButton onClick={toggleMicrophone} isMicrophoneOn={isMicrophoneOn}>
          <IconImage src={voiceIcon} alt="Voice Icon" />
        </IconButton>
        <IconButton onClick={toggleMute} isMuted={isMuted}>
          <IconImage src={headphoneIcon} alt="Headphone Icon" />
        </IconButton>
        <IconButton onClick={() => leaveSession(true)} isEndCall={true}>
          <IconImage src={callEndIcon} alt="Call End Icon" />
        </IconButton>
      </ButtonContainer>
      {!isOpen && <ToggleChatButton onClick={toggleChat} />}
      {shouldRender && (
        <Chat
          isOpen={isOpen}
          handleClose={handleCloseChat}
          session={session}
          messages={messages} // 메시지 상태 전달
          setMessages={setMessages} // 메시지 상태 변경 함수 전달
        />
      )}
    </Container>
  );
}

export default Mockuproom;