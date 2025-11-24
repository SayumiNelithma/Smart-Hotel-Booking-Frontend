import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

const FormFieldContext = React.createContext({ name: "" });

export function Form(props) {
  const { children, ...methods } = props;
  return <FormProvider {...methods}>{children}</FormProvider>;
}

export function FormField(props) {
  const { name, control, rules, shouldUnregister, render, ...rest } = props;
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        shouldUnregister={shouldUnregister}
        render={render}
        {...rest}
      />
    </FormFieldContext.Provider>
  );
}

export function FormItem({ className, ...props }) {
  return <div className={className} {...props} />;
}

export function FormLabel({ className, ...props }) {
  return <label className={className} {...props} />;
}

export function FormControl({ className, ...props }) {
  return <Slot className={className} {...props} />;
}

export function FormDescription({ className, ...props }) {
  return <p className={className} {...props} />;
}

export function FormMessage({ className = "text-red-600" }) {
  const { name } = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const message = name && formState?.errors?.[name]?.message;
  if (!message) return null;
  return <p className={className}>{String(message)}</p>;
}


