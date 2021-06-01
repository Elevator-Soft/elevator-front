export interface BuildStep {
  id: string;
  name: string;
  buildStepScript: Script;
}

export interface Script {
    command: string;
    arguments: string;
}
