// Common bad words and their variations (this is a basic list, you should expand it)
const badWords = [
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy', 'cock', 'cunt', 'whore',
  'slut', 'bastard', 'piss', 'damn', 'hell', 'crap', 'negro', 'nigga', 'nigger',
  'retard', 'faggot', 'fag', 'homo', 'queer', 'gay', 'lesbian', 'dyke',
  // Add more words as needed
].map(word => word.toLowerCase())

// Common leetspeak replacements
const leetMap: { [key: string]: string[] } = {
  'a': ['4', '@'],
  'e': ['3'],
  'i': ['1', '!'],
  'o': ['0'],
  's': ['5', '$'],
  't': ['7'],
  // Add more mappings as needed
}

export const containsProfanity = (text: string): boolean => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()
  
  // Check direct matches
  if (badWords.some(word => lowerText.includes(word))) {
    return true
  }

  // Check leetspeak variations
  const normalizedText = normalizeLeetspeak(lowerText)
  return badWords.some(word => normalizedText.includes(word))
}

const normalizeLeetspeak = (text: string): string => {
  let normalized = text
  Object.entries(leetMap).forEach(([letter, replacements]) => {
    replacements.forEach(replacement => {
      normalized = normalized.replace(new RegExp(replacement, 'g'), letter)
    })
  })
  return normalized
}

export const sanitizeUsername = (username: string): string => {
  // Remove special characters except - and _
  return username.replace(/[^a-zA-Z0-9-_]/g, '')
} 