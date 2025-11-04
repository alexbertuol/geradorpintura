export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('O FileReader não retornou uma string.'));
      }
      // result is "data:image/jpeg;base64,LzlqLzRBQ..."
      // we need to remove the prefix "data:[mime-type];base64,"
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};