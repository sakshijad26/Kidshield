import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        if (!dob || typeof dob !== "string") return 'N/A';
      
        // Check if dob format is "YYYY-MM-DD" or "DD-MM-YYYY"
        let birthDate;
      
        // Format check
        if (dob.includes('-')) {
          const parts = dob.split('-');
      
          if (parts[0].length === 4) {
            // Format: YYYY-MM-DD
            birthDate = new Date(dob);
          } else {
            // Format: DD-MM-YYYY → convert to YYYY-MM-DD
            const [day, month, year] = parts;
            birthDate = new Date(`${year}-${month}-${day}`);
          }
        } else {
          return 'N/A'; // Unsupported format
        }
      
        if (isNaN(birthDate.getTime())) return 'N/A'; // Invalid date fallback
      
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
      
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      
        return age;
      };
      
      
      

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider