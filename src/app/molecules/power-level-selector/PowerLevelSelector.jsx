import React from 'react';
import PropTypes from 'prop-types';
import './PowerLevelSelector.scss';
import { useTranslation } from 'react-i18next';

import IconButton from '../../atoms/button/IconButton';
import { MenuHeader, MenuItem } from '../../atoms/context-menu/ContextMenu';

import CheckIC from '../../../../public/res/ic/outlined/check.svg';

function PowerLevelSelector({
  value, max, onSelect,
}) {
  const handleSubmit = (e) => {
    const powerLevel = e.target.elements['power-level']?.value;
    if (!powerLevel) return;
    onSelect(Number(powerLevel));
  };
  const { t } = useTranslation();

  return (
    <div className="power-level-selector">
      <MenuHeader>{t('Molecules.PowerLevelSelector.title')}</MenuHeader>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
        <input
          className="input"
          defaultValue={value}
          type="number"
          name="power-level"
          placeholder={t('Molecules.PowerLevelSelector.placeholder')}
          max={max}
          autoComplete="off"
          required
        />
        <IconButton variant="primary" src={CheckIC} type="submit" />
      </form>
      {max >= 0 && <MenuHeader>{t('Molecules.PowerLevelSelector.presets')}</MenuHeader>}
      {max >= 100 && <MenuItem variant={value === 100 ? 'positive' : 'surface'} onClick={() => onSelect(100)}>{t('Molecules.PowerLevelSelector.admin')} - 100</MenuItem>}
      {max >= 50 && <MenuItem variant={value === 50 ? 'positive' : 'surface'} onClick={() => onSelect(50)}>{t('Molecules.PowerLevelSelector.mod')} - 50</MenuItem>}
      {max >= 0 && <MenuItem variant={value === 0 ? 'positive' : 'surface'} onClick={() => onSelect(0)}>{t('Molecules.PowerLevelSelector.member')} - 0</MenuItem>}
    </div>
  );
}

PowerLevelSelector.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PowerLevelSelector;
