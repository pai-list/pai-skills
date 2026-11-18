import React from 'react';
import { Box, Text, useInput } from 'ink';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateSchema } from '../../validator';

interface ValidatorViewProps {
  schemaDir: string;
  onRun: (running: boolean) => void;
  onResult: (result: string) => void;
}

export function ValidatorView({ schemaDir, onRun, onResult }: ValidatorViewProps) {
  useInput(input => {
    if (input !== 'r' && input !== 'R') return;
    onRun(true);
    try {
      const files = existsSync(schemaDir)
        ? readdirSync(schemaDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
        : [];
      const invalid = files.filter(f => !validateSchema(resolve(schemaDir, f)).valid);
      onResult(`Validated ${files.length} schemas (${invalid.length} failed)`);
    } catch (err) {
      onResult(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      onRun(false);
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Schema Validator</Text>
      <Text>Directory: {schemaDir}</Text>
      <Text color="gray">Press [R] to validate endpoint schemas.</Text>
    </Box>
  );
}
