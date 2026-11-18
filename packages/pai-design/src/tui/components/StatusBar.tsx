// Pai-TUI — StatusBar component
import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  running: boolean;
  lastResult: string;
}

export function StatusBar({ running, lastResult }: StatusBarProps) {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color={running ? 'yellow' : 'green'}>
          {running ? '⟳ Running...' : '✓ Ready'}
        </Text>
        <Text color="gray" dimColor>
          {lastResult ? `Last: ${lastResult.slice(0, 60)}...` : 'No results yet'}
        </Text>
      </Box>
    </Box>
  );
}