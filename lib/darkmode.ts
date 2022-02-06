const initializeDarkmode = () => {
  if(!localStorage.getItem('darkmode')) localStorage.setItem('darkmode', 'light')
  const theme = localStorage.getItem('darkmode')
  if(theme === 'dark') document.documentElement.classList.add('dark')
}

const updateDOM = () => {
  const theme = localStorage.getItem('darkmode')
  if(theme === 'dark') {
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
      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('darkmode', 'dark')
      } else {
        localStorage.setItem('darkmode', 'light')
      }
      break
  }
  updateDOM()
}

const getCurrentTheme = () => {
  const theme = localStorage.getItem('darkmode')
  return theme
}

export { initializeDarkmode as default, initializeDarkmode, changeDarkmode, updateDOM, getCurrentTheme }