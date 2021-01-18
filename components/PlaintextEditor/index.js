import React, { useState, useEffect } from 'react';
import path from 'path';
import PropTypes from 'prop-types';

import css from './style.css';

// TODO: set path by using path.parse and combining dir with the new name

function PlaintextEditor({ file, write }) {
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isTextEdited, setIsTextEdited] = useState(false);

  useEffect(() => {
    (async () => {
      setIsTextEdited(false);
      setIsEditingName(false);
      setValue(await file.text());
      setName(path.basename(file.name));
    })();
  }, [file]);

  const handleChangeText = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsTextEdited(true);
    setValue(e.target.value);
  };

  const handleClickSaveName = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFile = new File(
      [await file.text()],
      `${path.dirname(file.name)}${name}`,
      {
        type: 'text/plain',
        lastModified: new Date()
      }
    );
    write(newFile, file);
    setIsEditingName(false);
  };

  const handleClickSaveText = e => {
    e.preventDefault();
    e.stopPropagation();
    const newFile = new File(
      [value],
      `${path.dirname(file.name)}${name}`,
      {
        type: 'text/plain',
        lastModified: new Date()
      }
    );
    write(newFile, file);
    setIsTextEdited(false);
  };

  const handleChangeName = e => {
    e.preventDefault();
    e.stopPropagation();
    setName(e.target.value);
  };

  return (
    <div className={css.preview}>
      <div className={css.title}>
        {isEditingName ? (
          <>
            <input onChange={handleChangeName} value={name} />
            <span className={css.saveButton} onClick={handleClickSaveName}>Save</span>
          </>
        ) : (
          <span onClick={() => setIsEditingName(true)}>{name}</span>
        )}
        <div style={{ float: 'right' }}>
          <span className={css.saveButton} onClick={handleClickSaveText}>Save</span>
          {isTextEdited && (
            <span className={css.editedText}>-- Edited</span>
          )}
        </div>
      </div>
      <textarea className={css.content} onChange={handleChangeText} value={value} />
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
