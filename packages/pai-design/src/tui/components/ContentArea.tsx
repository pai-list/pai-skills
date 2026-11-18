// Pai-TUI — ContentArea component
import React from 'react';
import { Box } from 'ink';

interface ContentAreaProps {
  children: React.ReactNode;
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <Box flexGrow={1} padding={1}>
      {children}
    </Box>
  );
}