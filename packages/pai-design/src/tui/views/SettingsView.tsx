import React from 'react';
import { Box, Text } from 'ink';

interface SettingsViewProps {
  schemaDir: string;
  outputDir: string;
  onSchemaDirChange: (dir: string) => void;
  onOutputDirChange: (dir: string) => void;
}

export function SettingsView({ schemaDir, outputDir }: SettingsViewProps) {
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Settings</Text>
      <Text>Schema Directory: {schemaDir}</Text>
      <Text>Output Directory: {outputDir}</Text>
    </Box>
  );
}
