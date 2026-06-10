function downloadFile(data, fName, extension) {
  const fx = _checkFileExtension(fName, extension);
  const filename = fx[0];
  let saveData = data;

  if (!(saveData instanceof Blob)) {
    saveData = new Blob([data]);
  }

  if(document){
    const url = URL.createObjectURL(saveData);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

function _checkFileExtension(filename, extension) {
  if (!extension || extension === true || extension === 'true') {
    extension = '';
  }
  if (!filename) {
    filename = 'untitled';
  }
  let ext = '';
  // make sure the file will have a name, see if filename needs extension
  if (filename && filename.includes('.')) {
    ext = filename.split('.').pop();
  }
  // append extension if it doesn't exist
  if (extension) {
    if (ext !== extension) {
      ext = extension;
      filename = `${filename}.${ext}`;
    }
  }
  return [filename, ext];
}

export { downloadFile, _checkFileExtension };
