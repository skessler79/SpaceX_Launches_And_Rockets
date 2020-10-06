export const checkFileSize = (
  file: File,
  sizeInMb: number = 6
): Promise<boolean> => {
  const size = sizeInMb * 1024 * 1024;
  return new Promise((resolve, reject) => {
    if (file.size > size) {
      return reject(
        new Error(`File is too large and it must not exceed ${sizeInMb}mb`)
      );
    }
    return resolve(true);
  });
};

export const checkMimeType = (
  file: File,
  mediaType?: "image" | "document" | "both",
  extraMimeTypes?: string[]
): Promise<boolean> => {
  const newAddedTypes = extraMimeTypes || [];
  const imageMimeList = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const documentMimeList = ["application/pdf"];
  let types: string[] = [];

  if (mediaType === "image") types = imageMimeList;
  if (mediaType === "document") types = documentMimeList;
  if (mediaType === "both") types = [...imageMimeList, ...documentMimeList];

  return new Promise((resolve, reject) => {
    if ([...types, ...newAddedTypes].every((type) => file.type !== type)) {
      return reject(new Error(`${file.type} is not a supported format`));
    }
    return resolve(true);
  });
};

export default {
  checkFileSize,
  checkMimeType
};
