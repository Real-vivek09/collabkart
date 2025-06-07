import React from 'react';

const MessageBubble = ({ message, isSender, senderName, timestamp }) => {
  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isSender
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm font-semibold">{senderName}</p>
        <p>{message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {timestamp?.toDate().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;