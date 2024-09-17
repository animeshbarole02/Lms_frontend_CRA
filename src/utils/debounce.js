const debounce = (func, delay) => {
  let timer;

  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
};

export default debounce;