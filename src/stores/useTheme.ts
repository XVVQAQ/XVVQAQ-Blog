export default function useTheme() {
  let theme=localStorage.getItem('theme')

  const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
  if(!theme){
    localStorage.setItem('theme',themeMedia? 'light' : 'dark')
  }else{
    document.documentElement.classList.add(theme)
  }

  const toggleTheme = () => {
    switch(localStorage.getItem('theme')){
      case 'dark':
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme','light')
        break
      case 'light':
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        localStorage.setItem('theme','dark')
    }
  }

  return {
    toggleTheme
  }
}
