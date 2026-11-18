// Pai-TUI — Main App with navigation
import React, { useState } from 'react';
import { Box, useInput } from 'ink';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { StatusBar } from './components/StatusBar';
import { ValidatorView } from './views/ValidatorView';
import { GeneratorView } from './views/GeneratorView';
import { DesignerView } from './views/DesignerView';
import { SkillsView } from './views/SkillsView';
import { SettingsView } from './views/SettingsView';

export type ViewType = 'validator' | 'generator' | 'designer' | 'skills' | 'settings';

export function App() {
  const [activeView, setActiveView] = useState<ViewType>('validator');
  const [schemaDir, setSchemaDir] = useState<string>('./schemas');
  const [outputDir, setOutputDir] = useState<string>('./generated');
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  useInput((input, key) => {
    if (key.ctrl && input === 'c') process.exit(0);
    if (input === '1') setActiveView('validator');
    if (input === '2') setActiveView('generator');
    if (input === '3') setActiveView('designer');
    if (input === '4') setActiveView('skills');
    if (input === '5') setActiveView('settings');
    if (input === 'q' || input === 'Q') process.exit(0);
  });

  return (
    <Box flexDirection="column" height="100%">
      <Header />
      <Box flexDirection="row" flexGrow={1}>
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <ContentArea>
          {activeView === 'validator' && <ValidatorView schemaDir={schemaDir} onRun={setRunning} onResult={setLastResult} />}
          {activeView === 'generator' && <GeneratorView schemaDir={schemaDir} outputDir={outputDir} onRun={setRunning} onResult={setLastResult} />}
          {activeView === 'designer' && <DesignerView outputDir={outputDir} onRun={setRunning} onResult={setLastResult} />}
          {activeView === 'skills' && <SkillsView />}
          {activeView === 'settings' && <SettingsView schemaDir={schemaDir} outputDir={outputDir} onSchemaDirChange={setSchemaDir} onOutputDirChange={setOutputDir} />}
        </ContentArea>
      </Box>
      <StatusBar running={running} lastResult={lastResult} />
    </Box>
  );
}