import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadFileFromURL({
  fileURL,
  fileName,
}: {
  fileURL: string;
  fileName: string;
}) {
  fetch(fileURL, {
    method: 'GET',
    headers: {},
  })
    .then((response) => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // clean up the DOM
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
