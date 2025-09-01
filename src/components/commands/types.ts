type ActionTarget = {
  action: () => void;
};

type NavigationTarget = {
  url: string;
};

export type Chord = [string, string];

export type ActionCommand = {
  chord: Chord;
  target: ActionTarget;
};

export type NavigationCommand = {
  chord: Chord;
  target: NavigationTarget;
};

export type Command = ActionCommand | NavigationCommand;
