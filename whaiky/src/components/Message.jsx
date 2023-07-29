import React from 'react'

export const Message = () => {
  return (
    <div
    className="message"
  >
    <div className="messageInfo">
      <img
        src="https://www.w3schools.com/howto/img_avatar2.png"
        alt=""
      />
      <span>just now</span>
    </div>
    <div className="messageContent">
      <p>random message</p>
     
    </div>
  </div>
  )
}

export default Message