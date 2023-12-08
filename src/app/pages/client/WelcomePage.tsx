import React from 'react';
import { Box, Button, Icon, Icons, Text, config, toRem } from 'folds';
import { useTranslation } from 'react-i18next';
import { Page, PageHero, PageHeroSection } from '../../components/page';
import CinnySVG from '../../../../public/res/svg/cinny.svg';
import cons from '../../../client/state/cons';

export function WelcomePage() {
  const { t } = useTranslation();
  return (
    <Page>
      <Box
        grow="Yes"
        style={{ padding: config.space.S400, paddingBottom: config.space.S700 }}
        alignItems="Center"
        justifyContent="Center"
      >
        <PageHeroSection>
          <PageHero
            icon={<img width="70" height="70" src={CinnySVG} alt="Cinny Logo" />}
            title={t('Organisms.Welcome.heading')}
            subTitle={
              <span>
                {t('Organisms.Welcome.subheading')}{' '}
                <a
                  href="https://github.com/cinnyapp/cinny/releases"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {`v${cons.version}`}
                </a>
              </span>
            }
          />
        </PageHeroSection>
      </Box>
    </Page>
  );
}
