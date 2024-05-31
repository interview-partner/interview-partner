import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserVideoComponent from '../../components/UserVideoComponent';
import { initializeSession } from '../../services/openviduService';
import voiceIcon from '../../assets/icons/voice_Icon.png';
import headphoneIcon from '../../assets/icons/headphone_Icon.png';
import callEndIcon from '../../assets/icons/call_end_Icon.png';
import Chat from './chat';
import { Container, VideoContainer, ButtonContainer, IconButton, IconImage, ChatIcon } from './mockuproomstyle';

const MAX_PARTICIPANTS = 4;

function Mockuproom() {
  //입장토큰 
  const location = useLocation();
  const { token } = location.state || {};

  const navigate = useNavigate();

  //채탕창 열고 닫기
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);
  const handleCloseChat = () => setIsOpen(false);

  const [session, setSession] = useState(undefined);

  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const OV = useRef(null);
  const hasJoined = useRef(false);

  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  }, [mainStreamManager]);

  const updateUsers = useCallback(() => {
    console.log("------유저 업데이트 하기-------", session)
    if (session) {
      console.log('----세션 연결 데이터----', session.connection.data);
      // Map 객체인 session.remoteConnections를 배열로 변환하여 사용
      const userList = [
        { id: session.connection.connectionId, data: session.connection.data },
        ...Array.from(session.remoteConnections.values()).map((conn) => ({
          id: conn.connectionId,
          data: conn.data,
        }))
      ];
      setUsers(userList);
      console.log('Updated users:', userList);
    }
  }, [session]);

  useEffect(() => {
    console.log("세션 상태 변경 후 유저 목록 업데이트 시도");
    updateUsers();
  }, [session, updateUsers]);

  const joinSession = useCallback(async () => {
    console.log("----조인 세션 호출하기---------")

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

    console.log("------------마이세션 출력하기---------", mySession);

    OV.current = newOV;

    try {
      await mySession.connect(token, { clientData: 'MyNickname' });
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
      mySession.on('connectionCreated', updateUsers);
      mySession.on('connectionDestroyed', updateUsers);

      updateUsers();
    } catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
      if (error.code === 401) {
        alert('Authentication error. Please log in again.');
        navigate('/');
      }
    }
  }, [navigate, updateUsers]);

  const leaveSession = useCallback(() => {
    if (session) {
      if (publisher) {
        publisher.stream.getMediaStream().getTracks().forEach(track => track.stop());
        session.unpublish(publisher);
      }
      session.disconnect();
    }

    OV.current = null;
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);

    hasJoined.current = false;
  }, [session, publisher]);

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
        <IconButton>
          <IconImage src={voiceIcon} alt="Voice Icon" />
        </IconButton>
        <IconButton>
          <IconImage src={headphoneIcon} alt="Headphone Icon" />
        </IconButton>
        <IconButton onClick={() => { leaveSession(); navigate('/mockupcommunity'); }}>
          <IconImage src={callEndIcon} alt="Call End Icon" />
        </IconButton>
      </ButtonContainer>
      {!isOpen && <ChatIcon onClick={toggleChat} />}
      <Chat
        isOpen={isOpen}
        handleClose={handleCloseChat}
        session={session}
        users={users}
      />
    </Container>
  );
}

export default Mockuproom;
