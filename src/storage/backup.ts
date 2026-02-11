export const downloadJsonFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

export const readJsonFile = async (file: File): Promise<string> => {
  return await file.text();
};
