export const generatePassword = (length = 12) => {
  
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";
  

    const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
  
    
    const getRandomCharacter = (characters) => characters[Math.floor(Math.random() * characters.length)];
  
    let password = [
      getRandomCharacter(uppercaseLetters),
      getRandomCharacter(lowercaseLetters),
      getRandomCharacter(numbers),
      getRandomCharacter(specialCharacters),
    ];
  
  
    for (let i = password.length; i < length; i++) {
      password.push(getRandomCharacter(allCharacters));
    }
  
    
    password = password.sort(() => Math.random() - 0.5);
  
  
    return password.join('');
  }