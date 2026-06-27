import type { ComponentType } from "react";
import { TextField } from "./TextField";
import { ObjectField } from "./ObjectField";
import { ArrayField } from "./ArrayField";
import type { ConfigField, FieldContext } from "../types";

const registry: Record<ConfigField["type"], ComponentType<FieldContext>> = {
  text: TextField,
  number: TextField,
  textarea: TextField,
  object: ObjectField,
  array: ArrayField,
};

export const fieldRegistry = Object.freeze(registry) as Readonly<
  Record<ConfigField["type"], ComponentType<FieldContext>>
>;

export function FieldRenderer(props: FieldContext) {
  const Component = fieldRegistry[props.field.type];
  if (!Component) {
    return (
      <div className="text-sm text-destructive">
        Unknown field type: {props.field.type}
      </div>
    );
  }
  return <Component {...props} />;
}
