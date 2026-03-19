import { createContext,useContext,useEffect,useState} from "react";
const ThemeContext = createContext();
export const ThemeProvider = ({children}) => {
   const [theme, settheme] = useState(localStorage.getItem("theme") || "dark");
   useEffect(()=>{
    document.documentElement.classList.remove("dark","light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme",theme);
   },[theme]);

   return(
    <ThemeContext.Provider value={{theme,settheme}}>
        {children}
    </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);