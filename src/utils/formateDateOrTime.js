
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
  
  
  export const formatDateOrTime = (date) => {
    const d = new Date(date);
    
    const day = String(d.getDate()).padStart(2, '0'); 
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0'); 
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
  
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
  
    return `${formattedDate}, ${formattedTime}`;
  };