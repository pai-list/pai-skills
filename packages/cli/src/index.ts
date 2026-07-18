import { program } from 'commander';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { installCommand } from './commands/install.js';
import { publishCommand } from './commands/publish.js';
import { initCommand } from './commands/init.js';
import { infoCommand } from './commands/info.js';
import { uninstallCommand } from './commands/uninstall.js';
import { listTemplatesCommand } from './commands/templates.js';

program
  .name('pai-skills')
  .description('PAI Skills CLI - Manage skills for the Pi Network agent economy')
  .version('1.0.0');

program.addCommand(listCommand);
program.addCommand(searchCommand);
program.addCommand(installCommand);
program.addCommand(publishCommand);
program.addCommand(initCommand);
program.addCommand(infoCommand);
program.addCommand(uninstallCommand);
program.addCommand(listTemplatesCommand);

program.parse();