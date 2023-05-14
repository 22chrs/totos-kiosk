import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Menu,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useColorModeValue as mode,
  useDisclosure,
} from '@chakra-ui/react';

import NextLink from 'next/link';

import { MagicLink } from '@/components/links/CustomLink';

import { MenuButtonFull, MenuListBrand } from '@/components/layout/menu/Items';
import { Field, FieldProps, Form, Formik } from 'formik';

interface FormValues {
  email: string;
  password: string;
}

function validateEmail(value: string) {
  let error;
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
  }
  return error;
}

function validatePassword(value: string) {
  let error;
  if (value && value.length < 6) {
    error = 'Passwort muss mindestens 6 Zeichen lang sein';
  }
  return error;
}

function validateForm(values: FormValues) {
  const errors: Partial<FormValues> = {};
  if (!values.email) {
    errors.email = 'E-Mail-Adresse ist erforderlich';
  }
  if (!values.password) {
    errors.password = 'Passwort ist erforderlich';
  }
  return errors;
}

function FormikEmailAndPassword() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={validateForm}
      onSubmit={(values: FormValues, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props) => (
        <Form>
          <Field name='email' validate={validateEmail}>
            {({ field, form }: FieldProps<string, FormValues>) => (
              <FormControl
                isInvalid={!!(form.errors.email && form.touched.email)}
              >
                <FormLabel fontWeight='700'>E-Mail-Adresse:</FormLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder=''
                  variant='standard'
                  border='2px'
                  bgColor={mode(
                    'formBGColor.lightMode',
                    'formBGColor.darkMode'
                  )}
                  color={mode(
                    'formFontColor.lightMode',
                    'formFontColor.darkMode'
                  )}
                  borderColor={mode(
                    'formBorderColor.lightMode',
                    'formBorderColor.darkMode'
                  )}
                />
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name='password' validate={validatePassword}>
            {({ field, form }: FieldProps<string, FormValues>) => (
              <FormControl
                mt={4}
                isInvalid={form.errors.password && form.touched.password}
              >
                <FormLabel fontWeight='700'>Passwort:</FormLabel>
                <Input
                  border='2px'
                  bgColor={mode(
                    'formBGColor.lightMode',
                    'formBGColor.darkMode'
                  )}
                  color={mode(
                    'formFontColor.lightMode',
                    'formFontColor.darkMode'
                  )}
                  borderColor={mode(
                    'formBorderColor.lightMode',
                    'formBorderColor.darkMode'
                  )}
                  variant='standard'
                  {...field}
                  type='password'
                  placeholder=''
                />
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                <FormHelperText>
                  <MagicLink as={NextLink}>Passwort vergessen?</MagicLink>
                </FormHelperText>
              </FormControl>
            )}
          </Field>

          <Button
            mt={8}
            colorScheme='brand'
            isLoading={props.isSubmitting}
            type='submit'
          >
            Log in
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export function SignInForm() {
  return (
    <Menu gutter={10}>
      <MenuButtonFull text='Sign In' />
      <MenuListBrand>
        <Stack py={4} px={4} minW='20vw'>
          <Box>
            <FormikEmailAndPassword />
          </Box>
        </Stack>
      </MenuListBrand>
    </Menu>
  );
}

export function SignInFormMobil() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button
        variant='outline'
        colorScheme='brand'
        onClick={onOpen}
        bgColor='transparent'
        border='2px'
        _hover={{ bgColor: 'transparent' }}
      >
        Sign In
      </Button>
      <Modal
        variant='toto'
        autoFocus={false}
        size='xs'
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay bg='blackAlpha.100' backdropFilter='blur(12px)' />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody textAlign='left'>
            <FormikEmailAndPassword />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
