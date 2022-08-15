import {
  Alert,
  Button,
  createStyles,
  Group,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AlertTriangle } from 'tabler-icons-react';

export function FriendTokenInput({ submit }) {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      token: '',
      expiry: '',
    },
  });

  return (
    <>
      <Alert icon={<AlertTriangle size={16} />} title="Missing token!">
        Follow the instructions on this page to gain access to friend activity.
      </Alert>

      <form onSubmit={form.onSubmit((values) => submit(values))}>
        <Stack spacing="lg">
          <TextInput
            required
            label="Token"
            placeholder="AQBI9Snrvrgb..."
            {...form.getInputProps('token')}
          />
          <TextInput
            required
            label="Expiry Date"
            placeholder="2023-03-09T02:36:24.046Z"
            {...form.getInputProps('expiry')}
          />
          <Group position="center">
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}

const useStyles = createStyles((theme) => ({}));
