// Utility function to format date and time to 'YYYY-MM-DDTHH:mm:ss'
export const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0'); 
    const hours = String(d.getHours()).padStart(2, '0'); 
    const minutes = String(d.getMinutes()).padStart(2, '0'); 
    const seconds = String(d.getSeconds()).padStart(2, '0'); 
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  
  
  export const formatDateOrTime = (dateString, issuanceType) => {
    const date = new Date(dateString);
    if (issuanceType === "Home") {
    
      return date.toLocaleDateString();
    } else if (issuanceType === "Library") {
     
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return dateString;
  };
  