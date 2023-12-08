import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ImagePackProfile.scss';
import { useTranslation } from 'react-i18next';

import { openReusableContextMenu } from '../../../client/action/navigation';
import { getEventCords } from '../../../util/common';

import Text from '../../atoms/text/Text';
import Avatar from '../../atoms/avatar/Avatar';
import Button from '../../atoms/button/Button';
import IconButton from '../../atoms/button/IconButton';
import Input from '../../atoms/input/Input';
import ImageUpload from '../image-upload/ImageUpload';
import ImagePackUsageSelector from './ImagePackUsageSelector';

import ChevronBottomIC from '../../../../public/res/ic/outlined/chevron-bottom.svg';
import PencilIC from '../../../../public/res/ic/outlined/pencil.svg';

function ImagePackProfile({
  avatarUrl, displayName, attribution, usage,
  onUsageChange, onAvatarChange, onEditProfile,
}) {
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nameInput, attributionInput } = e.target;
    const name = nameInput.value.trim() || undefined;
    const att = attributionInput.value.trim() || undefined;

    onEditProfile(name, att);
    setIsEdit(false);
  };

  const handleUsageSelect = (event) => {
    openReusableContextMenu(
      'bottom',
      getEventCords(event, '.btn-surface'),
      (closeMenu) => (
        <ImagePackUsageSelector
          usage={usage}
          onSelect={(newUsage) => {
            onUsageChange(newUsage);
            closeMenu();
          }}
        />
      ),
    );
  };
  const { t } = useTranslation();

  return (
    <div className="image-pack-profile">
      {
        onAvatarChange
          ? (
            <ImageUpload
              bgColor="#555"
              text={displayName}
              imageSrc={avatarUrl}
              size="normal"
              onUpload={onAvatarChange}
              onRequestRemove={() => onAvatarChange(undefined)}
            />
          )
          : <Avatar bgColor="#555" text={displayName} imageSrc={avatarUrl} size="normal" />
      }
      <div className="image-pack-profile__content">
        {
          isEdit
            ? (
              <form onSubmit={handleSubmit}>
                <Input name="nameInput" label={t('Molecules.ImagePack.name')} value={displayName} required />
                <Input name="attributionInput" label={t('Molecules.ImagePack.attribution')} value={attribution} resizable />
                <div>
                  <Button variant="primary" type="submit">{t('common.save')}</Button>
                  <Button onClick={() => setIsEdit(false)}>{t('common.cancel')}</Button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <Text>{displayName}</Text>
                  {onEditProfile && <IconButton size="extra-small" onClick={() => setIsEdit(true)} src={PencilIC} tooltip={t('common.edit')} />}
                </div>
                {attribution && <Text variant="b3">{attribution}</Text>}
              </>
            )
        }
      </div>
      <div className="image-pack-profile__usage">
        <Text variant="b3">{t('Molecules.ImagePack.pack_usage')}</Text>
        <Button
          onClick={onUsageChange ? handleUsageSelect : undefined}
          iconSrc={onUsageChange ? ChevronBottomIC : null}
        >
          <Text>
            {usage === 'emoticon' && t('Molecules.ImagePack.emoji')}
            {usage === 'sticker' && t('Molecules.ImagePack.sticker')}
            {usage === 'both' && t('Molecules.ImagePack.both')}
          </Text>
        </Button>
      </div>
    </div>
  );
}

ImagePackProfile.defaultProps = {
  avatarUrl: null,
  attribution: null,
  onUsageChange: null,
  onAvatarChange: null,
  onEditProfile: null,
};
ImagePackProfile.propTypes = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  attribution: PropTypes.string,
  usage: PropTypes.oneOf(['emoticon', 'sticker', 'both']).isRequired,
  onUsageChange: PropTypes.func,
  onAvatarChange: PropTypes.func,
  onEditProfile: PropTypes.func,
};

export default ImagePackProfile;
