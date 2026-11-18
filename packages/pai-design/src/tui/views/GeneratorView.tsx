import React from 'react';
import { Box, Text, useInput } from 'ink';
import { listTemplates } from '../../generator';

interface GeneratorViewProps {
  schemaDir: string;
  outputDir: string;
  onRun: (running: boolean) => void;
  onResult: (result: string) => void;
}

export function GeneratorView({ schemaDir, outputDir, onRun, onResult }: GeneratorViewProps) {
  useInput(input => {
    if (input !== 'g' && input !== 'G') return;
    onRun(true);
    try {
      const templates = listTemplates();
      onResult(`Loaded ${templates.length} templates for ${outputDir}`);
    } catch (err) {
      onResult(err instanceof Error ? err.message : 'Generator check failed');
    } finally {
      onRun(false);
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Endpoint Generator</Text>
      <Text>Schemas: {schemaDir} → Output: {outputDir}</Text>
      <Text color="gray">Press [G] to inspect available templates.</Text>
    </Box>
  );
}
