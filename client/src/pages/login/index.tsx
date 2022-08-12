import { Button, Container, CSSObject } from '@mantine/core';

export default function LoginPage() {
  return (
    <Container sx={loginWrapper}>
      <Button
        component="a"
        href={'http://localhost:3001/api/login'}
        uppercase
        sx={loginButton}
      >
        Log in
      </Button>
    </Container>
  );
}

const loginWrapper: CSSObject = {
  display: 'flex',
  minHeight: '100vh',
};

const loginButton: CSSObject = {
  margin: 'auto',
};
