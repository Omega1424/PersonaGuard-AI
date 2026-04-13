import React from 'react'

function InputBar({ inputMessage, setInputMessage, handleSubmit, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-user-bubble focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-text placeholder-gray-400"
          aria-label="Message input"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !inputMessage.trim()}
        className="bg-user-bubble text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-user-bubble focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px] flex items-center justify-center"
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <span className="text-sm font-medium">Send</span>
        )}
      </button>
    </form>
  )
}

export default InputBar