import {
  ActionIcon,
  ActionIconVariant,
  Button,
  ButtonVariant,
  createStyles,
  Group,
  MantineGradient,
  Menu,
} from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white'
    }`,
  },

  outlinedMenuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: `1px solid`,
    marginLeft: '1px',
  },
}));

type SplitButtonProps = {
  text?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  gradient?: MantineGradient;
  leftIcon?: JSX.Element;
  onClick: () => Promise<void>;
  menuVariant?: ActionIconVariant;
  menuItems: {
    text?: string;
    icon?: JSX.Element;
    onClick: () => Promise<void>;
  }[];
};

export function SplitButton({
  text = '',
  fullWidth = false,
  variant = 'filled',
  gradient,
  leftIcon,
  onClick,
  menuVariant = 'filled',
  menuItems,
}: SplitButtonProps) {
  const { classes, theme } = useStyles();

  return (
    <Group noWrap spacing={0}>
      <Button
        className={classes.button}
        fullWidth={fullWidth}
        variant={variant}
        gradient={variant === 'gradient' ? gradient : undefined}
        leftIcon={leftIcon}
        onClick={onClick}
      >
        {text}
      </Button>
      <Menu transition="pop" position="bottom-end">
        <Menu.Target>
          <ActionIcon
            variant={menuVariant}
            color={'cyan'}
            size={36}
            className={classes.menuControl}
          >
            <ChevronDown />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {menuItems.map((item, i) => (
            <Menu.Item icon={item.icon} onClick={item.onClick} key={i}>
              {item.text}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
