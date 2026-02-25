import { Command } from '../types/Command';

import * as afkpanel from './afkpanel';
import * as inactivepanel from './inactivepanel';
import * as carparkpanel from './carparkpanel';

const commands: Command[] = [afkpanel, inactivepanel, carparkpanel];

export const commandData = commands.map((cmd) => cmd.data.toJSON());

export const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));
