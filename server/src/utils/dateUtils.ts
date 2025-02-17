export const extractDate = (date: Date): string => {
    if (!date || !(date instanceof Date)) {
      throw new Error('Invalid date provided');
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  export const extractTime = (date: Date): string => {
    if (!date || !(date instanceof Date)) {
      throw new Error('Invalid date provided');
    }
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
  

    const period = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; 
  
    return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
  };