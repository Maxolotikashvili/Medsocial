export type TransformKey<T> = { from: keyof T; to: string };

export interface TransformValue {
  key: string; 
  value: (val: any) => any;
}

export interface TransformConfig<T> {
  transformKey?: TransformKey<T>[];
  transformValue?: TransformValue[];
  remove?: (keyof T)[];
}