import { TransformConfig } from "../../core/models/utility.model";

export function transformObject<T extends object>(
  data: T[],
  config: TransformConfig<T>
): Record<string, any>[] {
  const { transformKey = [], transformValue = [], remove = [] } = config;

  return data.map((obj) => {
    const transformed: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      const currentKey = key as keyof T;

      if (remove.includes(currentKey)) continue;

      const mapping = transformKey.find((t) => t.from === currentKey);
      const targetKey = mapping ? mapping.to : key;

      const valTransformer = transformValue.find((v) => v.key === targetKey);
      const finalValue = valTransformer ? valTransformer.value(value) : value;

      transformed[targetKey] = finalValue;
    }

    return transformed;
  });
}