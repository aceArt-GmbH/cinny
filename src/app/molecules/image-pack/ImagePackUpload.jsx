import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './ImagePackUpload.scss';
import { useTranslation } from 'react-i18next';

import initMatrix from '../../../client/initMatrix';
import { scaleDownImage } from '../../../util/common';

import Text from '../../atoms/text/Text';
import Button from '../../atoms/button/Button';
import Input from '../../atoms/input/Input';
import IconButton from '../../atoms/button/IconButton';
import CirclePlusIC from '../../../../public/res/ic/outlined/circle-plus.svg';

function ImagePackUpload({ onUpload }) {
  const mx = initMatrix.matrixClient;
  const inputRef = useRef(null);
  const shortcodeRef = useRef(null);
  const [imgFile, setImgFile] = useState(null);
  const [progress, setProgress] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!imgFile) return;
    const { shortcodeInput } = evt.target;
    const shortcode = shortcodeInput.value.trim();
    if (shortcode === '') return;

    setProgress(true);
    const image = await scaleDownImage(imgFile, 512, 512);
    const { content_uri: url } = await mx.uploadContent(image);

    onUpload(shortcode, url);
    setProgress(false);
    setImgFile(null);
    shortcodeRef.current.value = '';
  };

  const handleFileChange = (evt) => {
    const img = evt.target.files[0];
    if (!img) return;
    setImgFile(img);
    shortcodeRef.current.value = img.name.slice(0, img.name.indexOf('.'));
    shortcodeRef.current.focus();
  };
  const handleRemove = () => {
    setImgFile(null);
    inputRef.current.value = null;
    shortcodeRef.current.value = '';
  };
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit} className="image-pack-upload">
      <input ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} type="file" accept=".png, .gif, .webp" required />
      {
        imgFile
          ? (
            <div className="image-pack-upload__file">
              <IconButton onClick={handleRemove} src={CirclePlusIC} tooltip={t('Molecules.ImagePack.remove_file')} />
              <Text>{imgFile.name}</Text>
            </div>
          )
          : <Button onClick={() => inputRef.current.click()}>{t('Molecules.ImagePack.import_image')}</Button>
      }
      <Input forwardRef={shortcodeRef} name="shortcodeInput" placeholder={t('Molecules.ImagePack.shortcode')} required />
      <Button disabled={progress} variant="primary" type="submit">{t(progress ? 'Molecules.ImagePack.uploading' : 'Molecules.ImagePack.upload')}</Button>
    </form>
  );
}
ImagePackUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImagePackUpload;
