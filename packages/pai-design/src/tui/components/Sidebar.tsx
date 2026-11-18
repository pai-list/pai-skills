// Pai-TUI — Sidebar component
import React from 'react';
import { Box, Text } from 'ink';
import type { ViewType } from '../App';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const VIEWS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'validator', label: 'Validator', icon: '✅' },
  { id: 'generator', label: 'Generator', icon: '⚡' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'skills', label: 'Skills', icon: '📦' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar({ activeView }: SidebarProps) {
  return (
    <Box flexDirection="column" width={22} borderStyle="single" borderColor="gray" padding={1} marginRight={1}>
      <Box marginBottom={1}>
        <Text bold color="green">PAI DESIGN</Text>
      </Box>
      {VIEWS.map(v => (
        <Box key={v.id} marginTop={1} paddingX={1}>
          <Text
            backgroundColor={activeView === v.id ? 'green' : undefined}
            color={activeView === v.id ? 'black' : 'white'}
            bold={activeView === v.id}
          >
            {v.icon} {v.label}
          </Text>
        </Box>
      ))}
      <Box
        flexDirection="column"
        marginTop={2}
        paddingTop={1}
        borderStyle="single"
        borderColor="gray"
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
      >
        <Text color="gray" dimColor>Shortcuts:</Text>
        <Text color="gray" dimColor>1-5: Switch view</Text>
        <Text color="gray" dimColor>Q: Quit</Text>
        <Text color="gray" dimColor>Ctrl+C: Exit</Text>
      </Box>
    </Box>
  );
}