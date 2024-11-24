import React from 'react';

const ResumeViewer = ({ resumeUrl }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <iframe
                    src={`${resumeUrl}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="User Resume"
                ></iframe>
            </div>
        </div>
    );
};

export default ResumeViewer;
