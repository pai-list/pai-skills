// Pai-TUI — Header component
import React from 'react';
import { Box, Text } from 'ink';

export function Header() {
  return (
    <Box borderStyle="single" borderColor="green" paddingX={1} marginBottom={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text bold color="green">PAI DESIGN</Text>
        <Text color="gray">v0.1.0 | Next.js + MagicUI + Physics</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
        <Text color="cyan">[1] Validator</Text>
        <Text color="cyan">[2] Generator</Text>
        <Text color="cyan">[3] Designer</Text>
        <Text color="cyan">[4] Skills</Text>
        <Text color="cyan">[5] Settings</Text>
        <Text color="gray">[Q] Quit</Text>
      </Box>
    </Box>
  );
}