import ReactTwemoji from 'react-twemoji'

interface twemojiProps {
  children: React.ReactChild
}

const Twemoji = ({ children }: twemojiProps) => {
  return (
    <ReactTwemoji noWrapper={true}>
      { children }
    </ReactTwemoji>
  )
}

export default Twemoji