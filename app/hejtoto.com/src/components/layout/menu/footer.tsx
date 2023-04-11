import { availableLanguages } from '@/internationalization/i18n';
import { GITHUB, INSTA, TIKTOK, YOUTUBE } from 'src/constants';

import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';

import {
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

import NextLink from 'next/link';

import { ButtonText } from '@/components/buttons/CustomButtons';
import LogoUniversalFooter from '@/components/logo/LogoUniversalFooter';

export default function Footer() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const isMobil = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });
  const isTablet = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    lg: true,
    xl: false,
  });

  return (
    <Grid
      justifyItems='center'
      pl={isMobil ? '5vw' : '10vw'}
      pr={isMobil ? '5vw' : '10vw'}
      templateColumns={{
        base: 'repeat(2, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(5, 1fr)',
      }}
      pt='20'
      pb='20 '
      bg={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
      color={useColorModeValue(
        'footerFontColor.lightMode',
        'footerFontColor.darkMode'
      )}
      //px='5vw'

      w='100%'
    >
      <GridItem colSpan={1}>
        <Box pb={isMobil || isTablet ? '12' : '8'}>
          <HStack justify='left' pb={isMobil || isTablet ? '6' : '8'} h={12}>
            <Link href='/' as={NextLink} style={{ textDecoration: 'none' }}>
              <LogoUniversalFooter
                width='auto'
                height={40}
                logoType='Logo'
                top={1.0}
              />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Icon as={FaTiktok} />
            <Link isExternal href={TIKTOK} className='myItem'>
              <ButtonText text='TikTok' />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Icon as={FaInstagram} />
            <Link isExternal href={INSTA} className='myItem'>
              <ButtonText text='Instagram' />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Icon as={FaYoutube} />
            <Link isExternal href={YOUTUBE} className='myItem'>
              <ButtonText text='YouTube' />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Icon as={FaGithub} />
            <Link isExternal href={GITHUB} className='myItem'>
              <ButtonText text='GitHub' />
            </Link>
          </HStack>
        </Box>
      </GridItem>

      <GridItem colSpan={1}>
        <Box pb={isMobil || isTablet ? '12' : '8'}>
          <HStack justify='left' pb={isMobil || isTablet ? '6' : '8'} h={12}>
            <Text variant='footerHeading'>{t('kontakt')}</Text>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/about/contact' className='myItem'>
              <ButtonText text='Say hello!' />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/about/about' className='myItem'>
              <ButtonText text={t('ueber-uns')} />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/about/jobs' className='myItem'>
              <ButtonText text={t('karriere')} />
            </Link>
          </HStack>
        </Box>
      </GridItem>

      <GridItem colSpan={1}>
        <Box pb={isMobil || isTablet ? '12' : '8'}>
          <HStack justify='left' pb={isMobil || isTablet ? '6' : '8'} h={12}>
            <Text variant='footerHeading'>{t('unser-service')}</Text>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/service/barista' className='myItem'>
              <ButtonText text='Barista Café' />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/service/dates' className='myItem'>
              <ButtonText text={t('veranstaltungen')} />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/service/places' className='myItem'>
              <ButtonText text={t('kollaboration')} />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/service/faqs' className='myItem'>
              <ButtonText text='FAQs' />
            </Link>
          </HStack>
        </Box>
      </GridItem>

      <GridItem colSpan={1}>
        <Box pb={isMobil || isTablet ? '12' : '8'}>
          <HStack justify='left' pb={isMobil || isTablet ? '6' : '8'} h={12}>
            <Text variant='footerHeading'>{t('rechtliches')}</Text>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/imprint' className='myItem'>
              <ButtonText text={t('impressum')} />
            </Link>
          </HStack>

          <HStack py='2' h={9}>
            <Link as={NextLink} href='/privacy' className='myItem'>
              <ButtonText text={t('datenschutz')} />
            </Link>
          </HStack>
        </Box>
      </GridItem>

      <GridItem colSpan={1}>
        <Box pb={isMobil || isTablet ? '12' : '8'}>
          <HStack justify='left' pb={isMobil || isTablet ? '6' : '8'} h={12}>
            <Icon as={FaGlobe} />
            <Text pt='0' variant='footerHeading'>
              Languages
            </Text>
          </HStack>
          {availableLanguages.map((lang) => (
            <Box key={lang}>
              <HStack py='2' h={9}>
                <Button
                  px='1.7rem'
                  fontWeight='400'
                  onClick={() => i18n.changeLanguage(lang)}
                  isDisabled={i18n.language === lang ? true : false}
                  className={i18n.language === lang ? 'myItemFalse' : 'myItem'}
                  sx={{
                    '.myItem:hover &': {
                      textDecoration: 'underline',
                      textDecorationThickness: '0.08rem',
                      textUnderlineOffset: '0.2rem',
                    },
                  }}
                  variant='footer'
                >
                  {lang}
                </Button>
              </HStack>
            </Box>
          ))}
        </Box>
      </GridItem>
    </Grid>
  );
}
