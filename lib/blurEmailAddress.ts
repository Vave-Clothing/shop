const blurEmailAddress = (email: string) => {
  const splitAddress = email.split('@')
  const splitDomain = splitAddress[1].split('.')
  const blurredAddress = splitAddress[0].substring(0, 2) + '***@' + splitDomain[0].substring(0, 2) + '***.' + splitDomain[splitDomain.length - 1]
  return blurredAddress
}

export default blurEmailAddress