import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { MenuHeader, MenuItem } from '../../atoms/context-menu/ContextMenu';

import CheckIC from '../../../../public/res/ic/outlined/check.svg';

function NotificationSelector({
  value, onSelect,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <MenuHeader>{t('Organisms.Settings.notifType.title')}</MenuHeader>
      <MenuItem iconSrc={value === 'off' ? CheckIC : null} variant={value === 'off' ? 'positive' : 'surface'} onClick={() => onSelect('off')}>{t('Organisms.Settings.notifType.off')}</MenuItem>
      <MenuItem iconSrc={value === 'on' ? CheckIC : null} variant={value === 'on' ? 'positive' : 'surface'} onClick={() => onSelect('on')}>{t('Organisms.Settings.notifType.on')}</MenuItem>
      <MenuItem iconSrc={value === 'noisy' ? CheckIC : null} variant={value === 'noisy' ? 'positive' : 'surface'} onClick={() => onSelect('noisy')}>{t('Organisms.Settings.notifType.noisy')}</MenuItem>
    </div>
  );
}

NotificationSelector.propTypes = {
  value: PropTypes.oneOf(['off', 'on', 'noisy']).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default NotificationSelector;
