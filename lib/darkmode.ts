const initializeDarkmode = () => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const current = getCurrentTheme()
  if(current === 'system') {
    if(media.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else if(current === 'dark') {
    document.documentElement.classList.add('dark')
  }

  media.addEventListener('change', () => {
    updateDOM()
  })
}

const updateDOM = () => {
  const theme = getCurrentTheme()
  if(theme === 'system') {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else if(theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const changeDarkmode = (theme: "light" | "dark" | "system") => {
  switch (theme) {
    case 'light':
      localStorage.setItem('darkmode', 'light')
      break
    case 'dark':
      localStorage.setItem('darkmode', 'dark')
      break
    case 'system':
      localStorage.setItem('darkmode', 'system')
      break
  }
  updateDOM()
}

const getCurrentTheme = () => {
  if(!localStorage.getItem('darkmode')) localStorage.setItem('darkmode', 'light')
  const theme = localStorage.getItem('darkmode')
  return theme
}

export { initializeDarkmode as default, initializeDarkmode, changeDarkmode, updateDOM, getCurrentTheme }