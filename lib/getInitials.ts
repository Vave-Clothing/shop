const getInitials = (input: string) => {
  if(input.length < 2) return input
  const splitInput = input.split(' ')
  const firstLetter = splitInput.map((i) => {
    return i.substring(0, 1).toUpperCase()
  })
  return firstLetter[0] + firstLetter[firstLetter.length - 1]
}

export default getInitials