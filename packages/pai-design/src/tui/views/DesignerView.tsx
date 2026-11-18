import React from 'react';
import { Box, Text, useInput } from 'ink';
import { existsSync } from 'node:fs';
import { runDesignerHarness } from '../../designer';

interface DesignerViewProps {
  outputDir: string;
  onRun: (running: boolean) => void;
  onResult: (result: string) => void;
}

export function DesignerView({ outputDir, onRun, onResult }: DesignerViewProps) {
  useInput(input => {
    if (input !== 'd' && input !== 'D') return;
    if (!existsSync(outputDir)) {
      onResult(`Output directory not found: ${outputDir}`);
      return;
    }
    onRun(true);
    try {
      const report = runDesignerHarness(outputDir);
      onResult(`Scanned ${report.summary.totalFiles} files (${report.summary.failed} failed)`);
    } catch (err) {
      onResult(err instanceof Error ? err.message : 'Designer audit failed');
    } finally {
      onRun(false);
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Designer Audit Harness</Text>
      <Text>Target: {outputDir}</Text>
      <Text color="gray">Press [D] to audit generated components.</Text>
    </Box>
  );
}
