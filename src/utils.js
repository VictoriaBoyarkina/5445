export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;